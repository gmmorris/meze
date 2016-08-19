// import isFunction from 'lodash.isfunction'
// import isPlainObject from 'lodash.isplainobject'
import flattenPromises from './FlattenPromises'
// function findDeepPromises (obj) {
//   let promises = []
//   for (let prop in obj) {
//     if (isPlainObject(obj[prop])) {
//       promises.push(...findDeepPromises(obj[prop]))
//     } else if (obj[prop] instanceof Promise) {
//       promises.push(obj[prop])
//     }
//   }
//   return promises
// }

// function onAllPromisesResolvedResolveWith (promises, resolution) {
//   return Promise.all(promises)
//     .then(() => resolution)
// }

// function mapChildToPromise (child) {
//   if (isPlainObject(child)) {
//     const promises = findDeepPromises(child)
//     if (promises.length) {
//       return onAllPromisesResolvedResolveWith(promises, child)
//     } else {
//       return Promise.resolve(child)
//     }
//   } else if (isFunction(child)) {
//     return mapChildToPromise(child())
//   } else if (child instanceof Promise) {
//     return child
//   }
//   return Promise.resolve(child)
// }

export const createComponent =
  (component, props = {}, children = []) => component({ ...props, children })

// export const createAsyncComponent =
//   (component, props, children) => {
//     const comp = createComponent(component, props, children)
//     const res = mapChildToPromise(comp)
//     return res
//   }

export function composeTree (component) {
  return flattenPromises(component)
}
