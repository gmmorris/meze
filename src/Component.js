import isFunction from 'lodash.isfunction'
import symbolPainer from './symbolPainter'

const { paint, painted } = symbolPainer('Component')

export default function Component (constructor) {
  function instanciate (props = {}) {
    return constructor({...props})
  }
  paint(instanciate)
  return instanciate
}

export const isComponent =
  component => component && painted(component)

export const supportsComponentisation =
  component => isFunction(component)

function componentise (constructor) {
  if (supportsComponentisation(constructor)) {
    return new Component(constructor)
  }
  throw new Error(`Invalid Component: Attempted to use object of type: ${typeof constructor}`)
}

function ensureIsComponent (candidate) {
  return isComponent(candidate)
    ? candidate
    : componentise(candidate)
}

export const createComponent =
  (component, props = {}, children = []) => ensureIsComponent(component)({ ...props, children })
