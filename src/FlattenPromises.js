function applyResolution (ref, key, promise) {
  return new Promise((resolve, reject) => {
    promise
      .then(resolution => {
        if (resolution instanceof Promise) {
          applyResolution(ref, key, resolution)
            .then(resolve)
        } else {
          ref[key] = resolution
          resolve(ref[key])
        }
      })
      .catch(err => reject(err))
  })
}

export default function flattenPromises (obj) {
  return Promise.all(Object
    .keys(obj)
    .reduce((promises, prop) => {
      if (obj[prop] instanceof Promise) {
        promises.push(applyResolution(obj, prop, obj[prop]))
      } else if (obj[prop] instanceof Object) {
        promises.push(applyResolution(obj, prop, flattenPromises(obj[prop])))
      }
      return promises
    }, [])).then(() => obj)
}
