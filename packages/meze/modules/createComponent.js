/* @flow */

import type { ComponentType } from './Component'

import isPlainObject from 'lodash.isplainobject'
import { isComponent } from './Component'
import { spreadChildren } from './Children'
import { isNonEmptyArray, isNullOrUndefined } from './utilities/validations'
import { componentise } from './utilities/componentise'

type componentisableType = Function
export type componentCreatorType = (component: componentisableType, props: Object, ...children: Array<any>) => any

//isString(candidate) ? createObjectify(candidate) : candidate
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

const middleware = []
function ensureIsComponent (candidate : componentisableType) : ComponentType {
  let composedCandidate = candidate
  if (!isComponent(composedCandidate)) {
    if (middleware.findIndex(delegate => {
      composedCandidate = delegate(candidate)
      return isComponent(composedCandidate)
    }) >= 0) {
      return composedCandidate
    } else {
      throw new Error(`Invalid Component: Attempted to use object of type: ${typeof constructor}`)
    }
  }
  return candidate
}

createComponent.addComponentisationMiddleware = delegate => {
  middleware.push(delegate)
  return createComponent
}

export default createComponent.addComponentisationMiddleware(componentise)
