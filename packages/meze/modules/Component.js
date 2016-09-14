import symbolPainter from './internals/symbolPainter'
import ComponentInstance from './ComponentInstance'
import isPlainObject from 'lodash.isplainobject'

const { paint, painted } = symbolPainter('Component')

export const isComponent =
  component => component && painted(component)

const valdiateProps = props => {
  if (!isPlainObject(props)) {
    throw new Error(`Invalid props: ${props}`)
  }
}

export function Component (constructor) {
  function instanciate (props = {}) {
    valdiateProps(props)
    // console.log(`instanciate`)
    // console.log(props)
    return new ComponentInstance(constructor, props)
  }
  instanciate.constructor = constructor
  paint(instanciate)
  return instanciate
}

export default {
  Component,
  isComponent
}
