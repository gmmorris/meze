/* @flow */
import isPlainObject from 'lodash.isplainobject'
import isObjectLike from 'lodash.isobjectlike'
import isArray from 'lodash.isarray'

import symbolPainer from '../utilities/symbolPainter'
import { isPromise } from '../utilities/isPromise'

const { paint, painted, clean } = symbolPainer('safe')

const safePaint = res => res && isObjectLike(res) ? paint(res) : res

function applyResolution (ref, key, promise) : Promise<*> {
  return promise.then(resolution => {
    ref[key] = resolution
    return processResolution(ref[key])
  })
}

function flattenPromisesInObject (obj) {
  return Promise.all(Object
    .keys(obj)
    .reduce((promises, prop) => {
      if (isPromise(obj[prop])) {
        promises.push(applyResolution(obj, prop, obj[prop]))
      } else if (isPlainObject(obj[prop])) {
        promises.push(applyResolution(obj, prop, flattenPromisesInObject(obj[prop])))
      } else if (isArray(obj[prop])) {
        promises.push(applyResolution(obj, prop, flattenPromisesInArray(obj[prop])))
      }
      return promises
    }, []))
    .then(() => paint(obj))
}

function flattenPromisesInArray (arr) {
  return Promise.all(arr.map(processResolution))
    .then(results => {
      arr.splice(0, arr.length, ...results)
      return arr
    })
}

function flattenPromisesInPromise (promise : Promise<*>) : Promise<*> {
  return promise
    .then(result => flattenPromises(result))
}

function processResolution (obj) {
  return isPromise(obj)
      ? flattenPromisesInPromise(obj)
      : (
        isPlainObject(obj) && !painted(obj)
        ? flattenPromisesInObject(obj)
        : (
          isArray(obj) && !painted(obj)
          ? flattenPromisesInArray(obj)
          : clean(obj)
        )
      )
}

export default function flattenPromises (obj : any) : Promise<any> {
  return new Promise((resolve, reject) => {
    const result = processResolution(obj)
    if (isPromise(result)) {
      result
        .then(resolution => {
          resolve(safePaint(resolution))
        })
        .catch(ex => reject(ex))
    } else {
      resolve(safePaint(result))
    }
  })
}
