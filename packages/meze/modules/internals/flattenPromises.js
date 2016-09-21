/* @flow */
import isPlainObject from 'lodash.isplainobject'
import symbolPainer from './symbolPainter'
import isObjectLike from 'lodash.isobjectlike'
import isArray from 'lodash.isarray'

function isPromsieLike (obj) : boolean {
  return obj &&
    typeof obj.then === 'function' &&
    typeof obj.catch === 'function'
}

function isPromsie (obj) {
  return obj && !isPlainObject(obj) && (
    obj instanceof Promise ||
    Object.getPrototypeOf(obj) === Promise ||
    isPromsieLike(obj)
  )
}

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
      if (isPromsie(obj[prop])) {
        promises.push(applyResolution(obj, prop, obj[prop]))
      } else if (isPlainObject(obj[prop])) {
        promises.push(applyResolution(obj, prop, flattenPromisesInObject(obj[prop])))
      }
      return promises
    }, []))
    .then(() => paint(obj))
}

function flattenPromisesInArray (arr) {
  return Promise.all(arr.map(processResolution))
    .then(paint)
}

function flattenPromisesInPromise (promise : Promise<*>) : Promise<*> {
  return promise
    .then(result => flattenPromises(result))
}

function processResolution (obj) {
  return isPromsie(obj)
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

export default function flattenPromises (obj : any) : Promise<*> {
  return new Promise(resolve => {
    const result = processResolution(obj)
    if (isPromsie(result)) {
      result.then(resolution => {
        resolve(safePaint(resolution))
      })
    } else {
      resolve(safePaint(result))
    }
  })
}
