import isPlainObject from 'lodash.isplainobject'
import isArray from 'lodash.isArray'
import isEmpty from 'lodash.isempty'
import isObjectLike from 'lodash.isobjectlike'
import isFunction from 'lodash.isfunction'
import findIndex from 'lodash.findindex'

import { isComponentInstance } from './ComponentInstance'
import flattenPromises from './internals/flattenPromises'
import symbolPainer from './internals/symbolPainter'

const { paint, painted } = symbolPainer('composed')

const isComplex = obj => isObjectLike(obj) || isFunction(obj)
function hasComplexProperties (obj) {
  return findIndex(Object.keys(obj), key => {
    return isComplex(obj[key])
  }) >= 0
}

function composeObject (obj) {
  Object
    .keys(obj)
    .forEach(key => {
      obj[key] = isComplex(obj[key]) ? Promise.resolve(compose(obj[key])) : obj[key]
    })
  return obj
}

function compose (component) {
  return painted(component) ? component : isComponentInstance(component)
    ? component().then(compose)
    : (
      isArray(component)
      ? component.map(innerComponent => compose(innerComponent))
      : (
        (isPlainObject(component) && !isEmpty(component) && hasComplexProperties(component))
        ? flattenPromises(composeObject(component))
        : component
      )
    )
}

export default function (component) {
  return flattenPromises(compose(component)).then(paint)
}
