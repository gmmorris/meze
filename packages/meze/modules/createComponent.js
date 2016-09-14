/* @flow */

import type { ComponentConstructorType, ComponentType } from './Component'

import isFunction from 'lodash.isfunction'
import { isComponent, Component } from './Component'

type componentisableType = Function
type componentCreatorType = (component: componentisableType, props: Object, ...children: Array<any>) => any

export const supportsComponentisation =
  (component : ComponentConstructorType) : boolean => isFunction(component)

const componentisationCache : { [key: Function]: ComponentType } = {}
export function componentise (constructor : ComponentConstructorType) : ComponentType {
  if (!supportsComponentisation(constructor)) {
    throw new Error(`Invalid Component: Attempted to use object of type: ${typeof constructor}`)
  }
  return (componentisationCache[constructor] = componentisationCache[constructor] || new Component(constructor))
}

function ensureIsComponent (candidate : componentisableType) : ComponentType {
  return isComponent(candidate)
    ? candidate
    : componentise(candidate)
}

const createComponent : componentCreatorType =
  (component, props = {}, ...children) : any => ensureIsComponent(component)({ ...props, children })

export default createComponent
