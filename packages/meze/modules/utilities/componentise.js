
import type { ComponentConstructorType, ComponentType } from '../Component'

import isFunction from 'lodash.isfunction'
import { Component } from '../Component'

export const supportsComponentisation =
  (component : ComponentConstructorType) : boolean => isFunction(component)

const componentisationCache : { [key: Function]: ComponentType } = {}
export function componentise (constructor : ComponentConstructorType) : ?ComponentType {
  if (supportsComponentisation(constructor)) {
    return (componentisationCache[constructor] = componentisationCache[constructor] || new Component(constructor))
  }
}
