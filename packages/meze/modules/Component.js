/* @flow */

import symbolPainter from './utilities/symbolPainter'
import ComponentInstance from './ComponentInstance'
import isPlainObject from 'lodash.isplainobject'

import type { ChildrenArray } from './Children'

export type ComponentPropType = {
  children?: ChildrenArray,
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

const { paint, painted } = symbolPainter('Component')

export const isComponent =
  (component : any) : boolean => component && painted(component)

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
    // console.log(`instanciate`)
    // console.log(props)
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
