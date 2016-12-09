/* @flow */
import isObjectLike from 'lodash.isobjectlike'

export function isPromsieLike (obj : any) : boolean {
  return obj &&
    typeof obj.then === 'function' &&
    typeof obj.catch === 'function'
}

export function isPromise (obj : any) : boolean {
  return isObjectLike(obj) && Promise.resolve(obj) === obj
}
