/* @flow */

import isPlainObject from 'lodash.isplainobject'

export function isPromsieLike (obj : any) : boolean {
  return obj &&
    typeof obj.then === 'function' &&
    typeof obj.catch === 'function'
}

export function isPromise (obj : any) : boolean {
  return obj && !isPlainObject(obj) && (
    obj instanceof Promise ||
    Object.getPrototypeOf(obj) === Promise ||
    isPromsieLike(obj)
  )
}
