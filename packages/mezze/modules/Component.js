import symbolPainter from './internals/symbolPainter'
import ComponentInstance from './ComponentInstance'

const { paint, painted } = symbolPainter('Component')

export const isComponent =
  component => component && painted(component)

export function Component (constructor) {
  function instanciate (props = {}) {
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
