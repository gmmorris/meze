/* @flow */

import isPlainObject from 'lodash.isplainobject'
import isArray from 'lodash.isarray'
import isEmpty from 'lodash.isempty'
import isObjectLike from 'lodash.isobjectlike'
import isFunction from 'lodash.isfunction'
import findIndex from 'lodash.findindex'

import { isComponentInstance } from './ComponentInstance'
import flattenPromises from './internals/flattenPromises'
import symbolPainer from './internals/symbolPainter'

type ComposedComponent = Promise<*>
type ComposableType = any

const { paint, painted } = symbolPainer('composed')

const isComplex = (obj : Object | Function) : boolean => isObjectLike(obj) || isFunction(obj)
function hasComplexProperties (obj : Object) : boolean {
  return findIndex(Object.keys(obj), key => {
    return isComplex(obj[key])
  }) >= 0
}

function composeObject (obj : Object) : Object {
  Object
    .keys(obj)
    .forEach(key => {
      obj[key] = isComplex(obj[key]) ? Promise.resolve(compose(obj[key])) : obj[key]
    })
  return obj
}

const hasAlreadyBeenComposed = (component : any) : boolean => painted(component)

const composeComponentArray =
  (component : Array<ComposableType>) : Array<ComposableType> =>
    component.map(innerComponent => compose(innerComponent))

const composePlainObject = (component : Object) : ComposableType => {
  return isEmpty(component) || !hasComplexProperties(component)
    ? component
    : flattenPromises(composeObject(component))
}

function compose (component : any) : ComposableType | Array<ComposableType> {
  if (hasAlreadyBeenComposed(component)) {
    return component
  } else if (isPlainObject(component)) {
    return composePlainObject(component)
  } else if (isArray(component)) {
    return composeComponentArray(component)
  }
  return isComponentInstance(component) ? component().then(compose) : component
}

export default function (component : any) : ComposedComponent {
  return flattenPromises(compose(component))
    .then(res => Promise.resolve(paint(res)))
}
