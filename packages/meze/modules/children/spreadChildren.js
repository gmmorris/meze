import isArray from 'lodash.isarray'

import Children, { isChildren } from './Children'

function flattenNestedChildArrays (children : any[]) : any[] {
  let index = -1
  let length = children.length

  while (++index < length) {
    let child = children[index]
    if (isChildren(child)) {
      children.splice(index, 1, ...child.toArray())
      length += (child.length - 1)
    } else if (isArray(child)) {
      children.splice(index, 1, ...child)
      length += (child.length - 1)
    }
  }
  return children
}

export default function (children : ?any[]) : ?Children {
  if (children) {
    return new Children(flattenNestedChildArrays(children))
  }
  return children
}
