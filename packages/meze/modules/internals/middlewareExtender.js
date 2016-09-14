
const addToMiddleware = (middleware, fn) => {
  middleware.push(fn)
}

export default function extendWithMiddleware (objectToExtend) {
  const middleware = []

  objectToExtend.then = (fn) => {
    addToMiddleware(middleware, fn)
    return objectToExtend
  }

  return function apply (resultToPipeThroughMiddleware) {
    return middleware.reduce((res, fn) => {
      return fn(res)
    }, resultToPipeThroughMiddleware)
  }
}
