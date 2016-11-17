import isPlainObject from 'lodash.isplainobject'
import isArray from 'lodash.isarray'
import isFunction from 'lodash.isfunction'
import valuesOf from 'lodash.values'
import { isComponentInstance } from '../ComponentInstance'
import { compareObjects, log } from '../utilities/helpers'

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
    return queryArray(selector, valuesOf(object), context)
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

function invalidType (method, type) {
  return `CompositionWrapper.${method}() can only be used to compare to a Component, and doesn't support ${type} types`
}

export default function CompositionWrapper (composition, context) {
  const find = defineFind(composition, context)
  const is = componentType => {
    if (isComponentInstance(componentType)) {
      return isComponentInstance(composition) && composition.instanceOf(componentType.constructor) &&
        compareObjects(composition.props, componentType.props)
    } else if (isComponent(componentType) || isFunction(componentType)) {
      return isComponentInstance(composition) && composition.instanceOf(componentType)
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
    contains: componentType => {
      if (isComponentInstance(componentType)) {
        return find(componentType.constructor)
          .find(child => compareObjects(child.props(), componentType.props)) !== undefined
      } else if (isComponent(componentType) || isFunction(componentType)) {
        return find(componentType).length > 0
      }
      throw Error(invalidType('contains', typeof componentType))
    }
  }
}
