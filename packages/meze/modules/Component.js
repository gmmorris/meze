/* @flow */

import symbolPainter from './internals/symbolPainter'
import ComponentInstance from './ComponentInstance'
import isPlainObject from 'lodash.isplainobject'

export type ComponentPropType = { children?: any[] }
export type ComponentConstructorType = (props: ?ComponentPropType) => any
export type ComponentType =
  () => any &
  {
    constructor: ComponentConstructorType
  }

const { paint, painted } = symbolPainter('Component')

export const isComponent =
  (component : any) : boolean => component && painted(component)

const valdiateProps = (props : ComponentPropType) : ComponentPropType => {
  if (!isPlainObject(props)) {
    throw new Error(`Invalid props`)
  }
  return props
}

export function Component (constructor : ComponentConstructorType) : ComponentType {
  function instanciate (props : ComponentPropType = {}) {
    // console.log(`instanciate`)
    // console.log(props)
    return new ComponentInstance(constructor, valdiateProps(props))
  }
  instanciate.constructor = constructor
  return paint(instanciate)
}

export default {
  Component,
  isComponent
}
