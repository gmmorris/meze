import isFunction from 'lodash.isfunction'
import { isComponent, Component } from './Component'

export const supportsComponentisation =
  component => isFunction(component)

const componentisationCache = {}
export function componentise (constructor) {
  if (!supportsComponentisation(constructor)) {
    throw new Error(`Invalid Component: Attempted to use object of type: ${typeof constructor}`)
  }
  return (componentisationCache[constructor] = componentisationCache[constructor] || new Component(constructor))
}

function ensureIsComponent (candidate) {
  return isComponent(candidate)
    ? candidate
    : componentise(candidate)
}

const createComponent =
  (component, props = {}, ...children) => ensureIsComponent(component)({ ...props, children })

export default createComponent
