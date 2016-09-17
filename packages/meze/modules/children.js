/* @flow */

import symbolPainter from './internals/symbolPainter'
import { identity } from './utilities/helpers'

const { paint, painted } = symbolPainter('ChildrenArray')

export const isChildrenArray =
  (comps : any) : boolean => comps && painted(comps)

function flattenNestedChldArrays (children : any[]) : any[] {
  let index = -1
  let length = children.length

  while (++index < length) {
    let child = children[index]
    if (isChildrenArray(child)) {
      children.splice(index, 1, ...child)
      length += (child.length - 1)
    }
  }
  return children
}

export const map =
  (children : any, mapper : (item: any, index: number) => any = identity) : any =>
    paint(children.map(mapper))

export function spreadChildren (children : any) : any {
  if (children && children.length) {
    return flattenNestedChldArrays(children)
  }
  return children
}

export default {
  map
}
