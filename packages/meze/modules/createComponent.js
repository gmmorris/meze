/* @flow */

import type { ComponentType } from './Component'

import isPlainObject from 'lodash.isplainobject'
import { isComponent } from './Component'
import { spreadChildren } from './children/Children'
import type { ChildrenArray } from './children/Children'
import { isNonEmptyArray } from './utilities/validations'
import { findTransformationWhere } from './utilities/helpers'

type componentisableType = Function
export type componentCreatorType = (component: componentisableType, props: Object, ...children: Array<any>) => any

const spreadProps = (props : Object) : Object =>
  isPlainObject(props)
    ? { ...props }
    : props

const ensureProps = (props : ?Object) : Object =>
  (props === null || props === undefined) // inlined instead of isNullOrUndefined until Flow supports this
  ? {}
  : spreadProps(props)

const processPropsChildren = (props : Object, children : any[]) : { children: ?ChildrenArray } =>
  isNonEmptyArray(children)
    ? Object.assign(props, { children: spreadChildren(children) })
    : props

const middleware = []

function ensureIsComponent (candidate : componentisableType) : ComponentType {
  if (!isComponent(candidate)) {
    candidate = findTransformationWhere(middleware, candidate, isComponent)
    if (candidate) {
      return candidate
    } else {
      throw new Error(`Invalid Component: Attempted to use object of type: ${typeof candidate}`)
    }
  }
  return candidate
}

function createComponent (component : any, props : ?Object, ...children : any[]) : any {
  // console.log(`constructor.name:${component.constructor.name}`)
  // console.log(`component.name:${this ? (this.name || component.name) : component.name}`)
  return ensureIsComponent(component)(processPropsChildren(ensureProps(props), children))
}

createComponent.addComponentisationMiddleware = delegate => {
  middleware.push(delegate)
  return createComponent
}

export default createComponent
