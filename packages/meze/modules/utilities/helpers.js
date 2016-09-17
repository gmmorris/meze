
export const identity = i => i

export const findTransformationWhere = (collection, candidate, predecate) => {
  let index = -1
  while (++index < collection.length) {
    let product = collection[index](candidate)
    if (predecate(product)) {
      return product
    }
  }
}
