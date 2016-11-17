import isPlainObject from 'lodash.isplainobject'
import isArray from 'lodash.isarray'
import { isComponentInstance } from '../ComponentInstance'
import isFunction from 'lodash.isfunction'

import { isComponent } from '../Component'

function queryComponentInstance (selector, componentInstance, context) {
  if (isComponent(selector) || isFunction(selector)) {
    return componentInstance.instanceOf(selector)
      ? CompositionWrapper(componentInstance, context)
      : undefined
  }
}

function queryObject (selector, object, context) {
  if (isComponent(selector) || isFunction(selector)) {
    return Object.keys(object).reduce((matches, key) => {
      if (isComponentInstance(object[key]) && object[key].instanceOf(selector)) {
        matches.push(CompositionWrapper(object[key], context))
      } else if (isPlainObject(object[key])) {
        return matches.concat(queryObject(selector, object[key], context))
      }
      return matches
    }, [])
  }
}

function queryArray (selector, array, context) {
  if (isComponent(selector) || isFunction(selector)) {
    return array.reduce((matches, item) => {
      if (isComponentInstance(item) && item.instanceOf(selector)) {
        matches.push(CompositionWrapper(item, context))
      } else if (isPlainObject(item)) {
        return matches.concat(queryObject(selector, item, context))
      } else if (isArray(item)) {
        return matches.concat(queryArray(selector, item, context))
      }
      return matches
    }, [])
  }
}

function asArray (result = []) {
  return Array.isArray(result) ? result : [result]
}

function defineFind (composition, context) {
  return (selector) => {
    let queryResult
    if (isComponentInstance(composition)) {
      queryResult = queryComponentInstance(selector, composition, context)
    } else if (isPlainObject(composition)) {
      queryResult = queryObject(selector, composition, context)
    } else if (isArray(composition)) {
      queryResult = queryArray(selector, composition, context)
    }
    return asArray(queryResult)
  }
}

export default function CompositionWrapper (composition, context) {
  return {
    composition,
    isEmpty: () => composition === undefined,
    props: propName => typeof propName === 'string' ? composition.props[propName] : composition.props,
    context: propName => typeof propName === 'string' ? context[propName] : context,
    find: defineFind(composition, context)
  }
}
