import isPlainObject from 'lodash.isplainobject'
import symbolPainer from './symbolPainter'

function consoleLog () {
  // console.log(...arguments)
}

function isPromsie (obj) {
  return obj && !isPlainObject(obj) && (
    obj instanceof Promise ||
    Object.getPrototypeOf(obj) === Promise ||
    typeof obj.then === 'function'
  )
}

const { paint, painted, clean } = symbolPainer('safe')

const applyResolution = msg => (ref, key, promise) => {
  return promise.then(resolution => {
    consoleLog(msg, 'key:', key)
    ref[key] = resolution
    return processResolution(ref[key])
  })
}

const flattenPromisesInObject = msg => (obj) => {
  painted(obj) ? consoleLog('shouldnt be parsed again') : null
  consoleLog('obj:', JSON.stringify(obj))
  return Promise.all(Object
    .keys(obj)
    .reduce((promises, prop) => {
      consoleLog(msg, 'prop:', prop)
      if (isPromsie(obj[prop])) {
        promises.push(applyResolution('applyPromise:')(obj, prop, obj[prop]))
      } else if (isPlainObject(obj[prop])) {
        promises.push(applyResolution('applyObj:')(obj, prop, flattenPromisesInObject(`in ${prop}:`)(obj[prop])))
      }
      return promises
    }, []))
    .then(() => paint(obj))
}

function log (x, msg) {
  consoleLog(...(msg ? [msg, x] : [x]))
  return x
}

function flattenPromisesInPromise (promise) {
  consoleLog('promise:', JSON.stringify(promise))
  return promise
    .then(result => flattenPromises(result))
}

function processResolution (obj) {
  (isPromsie(obj) ? consoleLog('is promise') : consoleLog('nope'))
  return isPromsie(obj)
      ? flattenPromisesInPromise(obj)
      : (
        isPlainObject(obj) && !painted(obj)
        ? flattenPromisesInObject('in processResolution:')(obj)
        : log(clean(obj), 'resolved:')
      )
}

export default function flattenPromises (obj) {
  return new Promise(resolve => {
    const result = processResolution(obj)
    if (isPromsie(result)) {
      result.then(resolution => {
        resolve(log(resolution, 'final:'))
      })
    } else {
      resolve(result)
    }
  })
}
