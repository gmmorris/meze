import { isComponentInstance } from './ComponentInstance'
import isPlainObject from 'lodash.isplainobject'
import isArray from 'lodash.isArray'
import flattenPromises from './internals/flattenPromises'

function composeObject (obj) {
  return Object
    .keys(obj)
    .reduce((result, key) => {
      result[key] = compose(obj[key])
      return result
    }, {})
}

function compose (component) {
  return isComponentInstance(component)
    ? compose(component.construct())
    : (
      isArray(component)
      ? component.map(innerComponent => compose(innerComponent))
      : (
        isPlainObject(component)
        ? composeObject(component)
        : component
      )
    )
}

export default function (component) {
  return flattenPromises(compose(component))
}
