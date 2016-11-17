import isFunction from 'lodash.isfunction'

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
