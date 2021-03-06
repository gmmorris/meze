/* @flow */
import isFunction from 'lodash.isfunction'
import isPlainObject from 'lodash.isplainobject'
import isempty from 'lodash.isempty'
import composeFunctions from 'lodash.flow'
import symbolPainter from './utilities/symbolPainter'
import { callIfFunction, freezeIfPossible, identity } from './utilities/helpers'
import { isNonEmptyArray } from './utilities/validations'
import createComponent from './createComponent'
import { isComponent } from './Component'
import { isChildren } from './children/Children'
import warning from './utilities/warning'
import createInstanceSerialiser, { serialize } from './utilities/createInstanceSerialiser'
import { isProductionMode } from './env'
import { validate, removeUndefinedPropTypeLocationMessage, PropTypeLocationNames, TypeLocation } from './types/PropTypes'

import type { ComponentConstructorType, ComponentPropType } from './Component'
import type { componentCreatorType } from './createComponent'
import type { Composer } from './compose'

const { paint, painted } = symbolPainter('ComponentInstance')
const { paint: paintConstruct, painted: paintedConstruct } = symbolPainter('ComponentInstance$constructed')

type InstanceConstructionType = () => Promise<*>
export type ComponentInstanceType =
  InstanceConstructionType &
  {
    props: ComponentPropType,
    clone: (cloneProps : ComponentPropType, ...cloneChildren : any[]) => componentCreatorType
  }
export type ComponentMountingContext =
  {
    compose?: Composer
  }

export const isComponentInstance =
  (instance : any) : boolean => instance && painted(instance)

function childrenAsArray (children : ?any) : any[] {
  return (children && isChildren(children) ? children.toArray() : (Array.isArray(children) ? children : []))
}

const setContextOnChildrenProp = (props : ComponentPropType, context : ?Object) : ComponentPropType => {
  if (props && props.children && isChildren(props.children)) {
    return { ...props, children: props.children.withContext(context) }
  }
  return props
}

function getTypesFromProperty (constructor: ComponentConstructorType, typeLocation) : ?Object {
  return isPlainObject(constructor[typeLocation]) ? constructor[typeLocation] : null
}

function getConstructorCompositionTypes (constructor: ComponentConstructorType) : ?Function {
  return isFunction(constructor[TypeLocation.composition])
    ? constructor[TypeLocation.composition]
    : null
}

function createCompositionTypeValidator (
  compositionType : ?Function, propTypeLocation : string, displayName : string,
  validate : Function, warn : Function) : ?Function {
  if (compositionType) {
    return composition => {
      return validate(
        { composition },
        { composition: compositionType },
        displayName, propTypeLocation, composeFunctions(removeUndefinedPropTypeLocationMessage, warn))
    }
  }
  return null
}

type PropTypeValidatableObject = ComponentPropType | ComponentMountingContext
function validatePropTypes (
  props : PropTypeValidatableObject, propTypes : ?Object, propTypeLocation : string, displayName : string, validate : Function) {
  if (!isempty(props) || propTypes) {
    validate(props, propTypes || {}, displayName, propTypeLocation, warning)
  }
}

function createOnComposed (componentWillUnmount : ?Function, validateCompositionType : ?Function) {
  return (isFunction(componentWillUnmount) || isFunction(validateCompositionType))
    ? promisedComposition => promisedComposition
      .then(composition => {
        callIfFunction(componentWillUnmount, composition)
        callIfFunction(validateCompositionType, composition)
        return composition
      })
    : identity
}

function attemptToMount (constructor: ComponentConstructorType, props : ComponentPropType, context : ?Object, warn : Function) {
  let composition
  try {
    composition = constructor(props, context)
    callIfFunction(props.componentDidMount, composition)
  } catch (ex) {
    composition = Promise.reject(ex)
    callIfFunction(props.componentFailedMount, ex)
    warn(ex)
  }
  return composition
}

const warnOfMountingError = (warnningMethod, instance, error) => {
  warnningMethod(`When mounting the following composition:
  ${serialize(instance)}

The composition threw the following error:
  ${error}`)
}

const isDevelopmentMode = () => !isProductionMode()
function instanciate (constructor: ComponentConstructorType, displayName: string, props: ComponentPropType,
  validateTypes : Function = validate, warn : Function = warning, shouldValidate : boolean = isDevelopmentMode())
 : ComponentInstanceType {
  const mount = (context : ComponentMountingContext = {}) => {
    if (shouldValidate) {
      validatePropTypes(props, getTypesFromProperty(constructor, TypeLocation.prop), PropTypeLocationNames.prop, displayName, validateTypes)
      validatePropTypes(context, getTypesFromProperty(constructor, TypeLocation.context), PropTypeLocationNames.context, displayName, validateTypes)
    }

    callIfFunction(props.componentWillMount)
    if (paintedConstruct(this)) {
      throw Error(`A ${displayName} Component Instance cannot be mounted twice`)
    }
    paintConstruct(this)

    const onComposed = createOnComposed(
      props.componentWillUnmount,
      shouldValidate
        ? createCompositionTypeValidator(
            getConstructorCompositionTypes(constructor), PropTypeLocationNames.composition, displayName, validateTypes, warn, isDevelopmentMode
          )
        : null
    )

    return {
      onComposed,
      composition: attemptToMount(
        constructor,
        setContextOnChildrenProp(props, context),
        freezeIfPossible(context),
        shouldValidate ? ex => warnOfMountingError(warn, mount, ex) : identity
      )
    }
  }

  mount.instanceOf = (component) => isFunction(component)
    ? component === constructor
    : (isComponent(component) ? component.constructor === constructor : false)

  mount.clone = function (cloneProps : ComponentPropType = {}, ...cloneChildren : any[]) : componentCreatorType {
    const { children, ...originalProps } = props
    return createComponent(
      constructor,
      { ...originalProps, ...cloneProps },
      ...(isNonEmptyArray(cloneChildren) ? cloneChildren : childrenAsArray(children))
    )
  }

  mount.props = Object.freeze(props)
  mount.constructor = constructor

  if (shouldValidate) {
    createInstanceSerialiser(mount, displayName, props)
  }

  return paint(mount)
}

export default instanciate
