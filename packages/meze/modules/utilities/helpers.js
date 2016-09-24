
export const identity = i => i

export const findTransformationWhere = (collection, candidate, predicate) => {
  let index = -1
  while (++index < collection.length) {
    let product = collection[index](candidate)
    if (predicate(product)) {
      return product
    }
  }
}

export function isEmpty (children) {
  return !(children && children.length)
}

export function hasMultiple (children) {
  return children && children.length > 1
}

export function filterOutUndefined (children) {
  return children.filter(res => res !== undefined)
}
