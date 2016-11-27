import isFunction from 'lodash.isfunction'
import isPlainObject from 'lodash.isplainobject'
import difference from 'lodash.difference'

export const log = i => {
  console.log(i)
  return i
}

export const identity = i => i
export const promisedIdentity = i => Promise.resolve(i)
export const freezeIfPossible = object => Object.freeze
  ? Object.freeze(object)
  : object

export const findTransformationWhere = (collection, candidate, predicate) => {
  let index = -1
  while (++index < collection.length) {
    let product = collection[index](candidate)
    if (predicate(product)) {
      return product
    }
  }
}

export function compareObjects (left, right) {
  if (!(isPlainObject(left) && isPlainObject(right))) {
    return false
  }
  const leftKeys = Object.keys(left)
  const rightKeys = Object.keys(right)
  return leftKeys.length === rightKeys.length &&
    difference(leftKeys, rightKeys).length === 0 &&
    leftKeys.reduce((areSame, key) => {
      return areSame && left[key] === right[key]
    }, true)
}

export function isEmpty (children) {
  return !(children && children.length)
}

export function hasMultiple (children) {
  return children && children.length > 1
}

export function filterOutUndefined (children) {
  return children.filter(res => res !== undefined)
}

export const callIfFunction = (fn, ...args) => fn && isFunction(fn) ? fn(...args) : false
