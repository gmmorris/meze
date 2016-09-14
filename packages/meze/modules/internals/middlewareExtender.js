/* @flow */

const addToMiddleware = (middleware : Function[], fn : Function) => {
  middleware.push(fn)
}

export default function extendWithMiddleware (objectToExtend : Object) : Function {
  const middleware : Function[] = []

  objectToExtend.then = (fn : Function) => {
    addToMiddleware(middleware, fn)
    return objectToExtend
  }

  return function apply (resultToPipeThroughMiddleware) {
    return middleware.reduce((res, fn) => {
      return fn(res)
    }, resultToPipeThroughMiddleware)
  }
}
