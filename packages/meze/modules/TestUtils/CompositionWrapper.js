import isPlainObject from 'lodash.isplainobject'
import isArray from 'lodash.isarray'
import isFunction from 'lodash.isfunction'
import valuesOf from 'lodash.values'

import createCompositionSelector from './CompositionSelector'
import { isComponentInstance } from '../ComponentInstance'
import { compareObjects, log } from '../utilities/helpers'
import { isComponent } from '../Component'
import { mapToArray, isChildrenArray } from '../Children'

function queryComponentInstance (selector, componentInstance, context) {
  const matches = []
  if (selector.matches(componentInstance)) {
    matches.push(CompositionWrapper(componentInstance, context))
  }
  if (componentInstance.props && isChildrenArray(componentInstance.props.children)) {
    matches.splice(matches.length, 0, ...queryArray(selector, mapToArray(componentInstance.props.children), context))
  }
  return matches
}

function queryObject (selector, object, context) {
  return queryArray(selector, valuesOf(object), context)
}

function queryArray (selector, array, context) {
  return array.reduce((matches, item) => {
    if (isComponentInstance(item)) {
      matches.splice(matches.length, 0, ...queryComponentInstance(selector, item, context))
    } else if (isPlainObject(item)) {
      return matches.concat(queryObject(selector, item, context))
    } else if (isArray(item)) {
      return matches.concat(queryArray(selector, item, context))
    }
    return matches
  }, [])
}

function asArray (result = []) {
  return Array.isArray(result) ? result : [result]
}

function defineFind (composition, context) {
  return (selector) => {
    const compositionSelector = createCompositionSelector(selector)
    let queryResult
    if (isComponentInstance(composition)) {
      queryResult = queryComponentInstance(compositionSelector, composition, context)
    } else if (isPlainObject(composition)) {
      queryResult = queryObject(compositionSelector, composition, context)
    } else if (isArray(composition)) {
      queryResult = queryArray(compositionSelector, composition, context)
    }
    return asArray(queryResult)
  }
}

function invalidType (method, type) {
  return `CompositionWrapper.${method}() can only be used to compare to a Component, and doesn't support ${type} types`
}

export default function CompositionWrapper (composition, context) {
  const find = defineFind(composition, context)
  const is = selector => {
    if (isComponentInstance(selector) || isComponent(selector) || isFunction(selector)) {
      return createCompositionSelector(selector).matches(composition)
    }
    throw Error(invalidType('is', typeof componentType))
  }
  const not = componentType => {
    if (isFunction(componentType) || isComponentInstance(componentType) || isComponent(componentType)) {
      return !is(componentType)
    }
    throw Error(invalidType('not', typeof componentType))
  }
  return {
    composition,
    isEmpty: () => composition === undefined,
    props: propName => typeof propName === 'string' ? composition.props[propName] : composition.props,
    context: propName => typeof propName === 'string' ? context[propName] : context,
    find,
    is,
    not,
    contains: selector => {
      if (isComponentInstance(selector) || isComponent(selector) || isFunction(selector)) {
        return find(selector).length > 0
      }
      throw Error(invalidType('contains', typeof componentType))
    }
  }
}
