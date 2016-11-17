/* @flow */
import isFunction from 'lodash.isfunction'
import isPlainObject from 'lodash.isplainobject'
import isempty from 'lodash.isempty'
import symbolPainter from './internals/symbolPainter'
import { callIfFunction, freezeIfPossible, identity, log } from './utilities/helpers'
import { isNonEmptyArray } from './utilities/validations'
import createComponent from './createComponent'
import { isComponent } from './Component'
import { isChildrenArray } from './Children'
import warning from './internals/warning'
import { validate, PropTypeLocationNames } from './PropTypes'

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
  return (children && isChildrenArray(children) ? children.toArray() : (Array.isArray(children) ? children : []))
}

const setContextOnChildrenProp = (props : ?Object, context : ?Object) => {
  if (props && props.children && isChildrenArray(props.children)) {
    return { ...props, children: props.children.withContext(context) }
  }
  return props
}

function validatePropTypes (constructor: ComponentConstructorType, displayName: string, props: ComponentPropType) {
  const propTypes = isPlainObject(constructor.PropTypes) ? constructor.PropTypes : false
  if (!isempty(props) || propTypes) {
    validate(props, propTypes || {}, displayName, PropTypeLocationNames.prop, warning)
  }
}

function createOnComposed (componentWillUnmount) {
  return isFunction(componentWillUnmount)
    ? promisedComposition => promisedComposition
      .then(composition => {
        callIfFunction(componentWillUnmount, composition)
        return composition
      })
    : identity
}

export default function (constructor: ComponentConstructorType, displayName: string, props: ComponentPropType) : ComponentInstanceType {
  const mount = (context : ComponentMountingContext = {}) => {
    validatePropTypes(constructor, displayName, props)
    callIfFunction(props.componentWillMount)
    if (paintedConstruct(this)) {
      throw Error(`A ${displayName} Component Instance cannot be mounted twice`)
    }
    paintConstruct(this)
    const composition = constructor(setContextOnChildrenProp(props, context), freezeIfPossible(context))
    callIfFunction(props.componentDidMount, composition)

    return {
      composition,
      onComposed: createOnComposed(props.componentWillUnmount)
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

  return paint(mount)
}
