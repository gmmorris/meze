
import type { ComponentConstructorType, ComponentType } from '../Component'

import isFunction from 'lodash.isfunction'
import { Component } from '../Component'

export const supportsComponentisation =
  (component : ComponentConstructorType) : boolean => isFunction(component)

const componentisationCache : { [key: Function]: ComponentType } = new Map()
export function componentise (constructor : ComponentConstructorType) : ?ComponentType {
  if (supportsComponentisation(constructor)) {
    if (!componentisationCache.has(constructor)) {
      componentisationCache.set(constructor, new Component(constructor))
    }
    return componentisationCache.get(constructor)
  }
}
