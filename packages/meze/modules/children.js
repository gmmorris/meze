/* @flow */
import symbolPainter from './internals/symbolPainter'
import { identity } from './utilities/helpers'

import compose from './compose'
import { isComponentInstance } from './ComponentInstance'

const { paint, painted } = symbolPainter('ChildrenArray')

// api

export const map =
  (children : any, mapper : (item: any, index: number) => any = identity) : any =>
    children ? paint(children.map(mapper)) : undefined

export const reduce =
  (children : any, reducer : (result: ?mixed, item: any, index: number) => any) : any =>
    children ? paint(children.reduce(reducer)) : undefined

export const spread =
  (children : any) : any => map(children)

export const cloneWithProps =
  (children : any, props : Object | () => Object) : any =>
    map(children, child =>
      isComponentInstance(child) ? child.clone(typeof props === 'function' ? props(child.props) : props) : child)

export const reduceComposed =
  (children : any = [], reducer : (result: ?mixed, item: any, index: number) => any, initialValue : ?any) : any =>
    compose(children)
      .then(composedChildren => reducer ? composedChildren.reduce(reducer, initialValue) : composedChildren)

// internal

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

export function spreadChildren (children : any) : any {
  if (children && children.length) {
    return flattenNestedChldArrays(children)
  }
  return children
}

// public API
export default {
  map,
  reduce,
  spread,
  reduceComposed,
  cloneWithProps
}
