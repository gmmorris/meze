import isPlainObject from 'lodash.isplainobject'
import symbolPainer from './symbolPainter'

function isPromsie (obj) {
  return obj && !isPlainObject(obj) && (
    obj instanceof Promise ||
    Object.getPrototypeOf(obj) === Promise ||
    typeof obj.then === 'function'
  )
}

const { paint, painted, clean } = symbolPainer('safe')

function applyResolution (ref, key, promise) {
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

function flattenPromisesInPromise (promise) {
  return promise
    .then(result => flattenPromises(result))
}

function processResolution (obj) {
  return isPromsie(obj)
      ? flattenPromisesInPromise(obj)
      : (
        isPlainObject(obj) && !painted(obj)
        ? flattenPromisesInObject(obj)
        : clean(obj)
      )
}

export default function flattenPromises (obj) {
  return new Promise(resolve => {
    const result = processResolution(obj)
    if (isPromsie(result)) {
      result.then(resolution => {
        resolve(resolution)
      })
    } else {
      resolve(result)
    }
  })
}
