/* @flow */

import type { ComponentConstructorType, ComponentType } from './Component'

import isFunction from 'lodash.isfunction'
import isPlainObject from 'lodash.isplainobject'
import { isComponent, Component } from './Component'
import { spreadChildren } from './Children'
import { isNonEmptyArray, isNullOrUndefined } from './utilities/validations'

type componentisableType = Function
export type componentCreatorType = (component: componentisableType, props: Object, ...children: Array<any>) => any

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

const spreadProps = props =>
  isPlainObject(props)
    ? { ...props }
    : props

const ensureProps = props =>
  isNullOrUndefined(props)
  ? {}
  : spreadProps(props)

const processPropsChildren = (props, children) =>
  isNonEmptyArray(children)
    ? Object.assign(props, { children: spreadChildren(children) })
    : props

const createComponent : componentCreatorType =
  (component, props, ...children) : any =>
    ensureIsComponent(component)(processPropsChildren(ensureProps(props), children))

export default createComponent
