/* @flow */

import symbolPainter from './internals/symbolPainter'
import ComponentInstance from './ComponentInstance'
import isPlainObject from 'lodash.isplainobject'

type ComponentPropType = Object
type ComponentConstructorType = (props: ComponentPropType) => any
type ComponentInstanciatorType =
  (props: ComponentPropType) => any &
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

export function Component (constructor : ComponentConstructorType) : ComponentInstanciatorType {
  function instanciate (props : ComponentPropType = {}) {
    // console.log(`instanciate`)
    // console.log(props)
    return new ComponentInstance(constructor, valdiateProps(props))
  }
  return paint(Object.assign(instanciate, { constructor }))
}

export default {
  Component,
  isComponent
}
