/* @flow */

import symbolPainter from './utilities/symbolPainter'
import ComponentInstance from './ComponentInstance'
import isPlainObject from 'lodash.isplainobject'
import isFunction from 'lodash.isfunction'
import curry from 'lodash.curry'

import Children from './children/Children'

export const isComponent =
  (component : any) : boolean => component && painted(component)

export const isInstanceOf =
  curry(
    (component : ComponentConstructorType | ComponentType, instance : any) : boolean =>
      isFunction(instance.instanceOf)
      ? instance.instanceOf(component)
      : false
  )

const { paint, painted } = symbolPainter('Component')

const valdiateProps = (props : ComponentPropType, componentName : string) : ComponentPropType => {
  if (!isPlainObject(props)) {
    throw new Error(`${componentName}: Invalid props have been provided for instanciation`)
  }
  return props
}

function getDisplayName (constructor : ComponentConstructorType) {
  return constructor.displayName || constructor.name || '<Anonymous>'
}

function applyDefaultProps (defaultProps : ?Object, props : ComponentPropType) {
  return defaultProps ? { ...defaultProps, ...props } : props
}

export function Component (constructor : ComponentConstructorType, displayName : string = getDisplayName(constructor)) : ComponentType {
  function instanciate (props : ComponentPropType = {}) {
    return new ComponentInstance(
      constructor,
      displayName,
      valdiateProps(applyDefaultProps(constructor.defaultProps, props), displayName)
    )
  }

  instanciate.constructor = constructor
  instanciate.displayName = displayName
  return paint(instanciate)
}

export default {
  Component,
  isComponent
}

export type ComponentPropType = {
  children?: Children,
  componentWillMount?: () => any,
  componentDidMount?: () => any,
  componentFailedMount?: () => any,
  componentWillUnmount?: () => any
}
export type ComponentConstructorType = (props: ?ComponentPropType) => any
export type ComponentType =
  () => any &
  {
    constructor: ComponentConstructorType
  }
