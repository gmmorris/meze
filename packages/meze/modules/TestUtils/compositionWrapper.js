import isPlainObject from 'lodash.isplainobject'
import isArray from 'lodash.isarray'
import isEmpty from 'lodash.isempty'
import isObjectLike from 'lodash.isobjectlike'
import { isComponentInstance } from '../ComponentInstance'
import isFunction from 'lodash.isfunction'

import { isComponent } from '../Component'

function queryComponentInstance (selector, componentInstance, context) {
  if (isComponent(selector) || isFunction(selector)) {
    return componentInstance.instanceOf(selector)
      ? CompositionWrapper(componentInstance, context)
      : CompositionWrapper()
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
