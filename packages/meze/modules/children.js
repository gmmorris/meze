/* @flow */
import symbolPainter from './internals/symbolPainter'
import { identity, isEmpty, hasMultiple, filterOutUndefined } from './utilities/helpers'

import compose from './compose'
import { isComponentInstance } from './ComponentInstance'

const { paint, painted } = symbolPainter('ChildrenArray')

// api

export const map =
  (children : any, mapper : (item: any, index: number) => any = identity) : any =>
    children ? paint(children.map(mapper)) : undefined

export const forEach =
  (children : any, mapper : (item: any, index: number) => any = identity) : any =>
    children ? paint(children.forEach(mapper)) : undefined

export const reduce =
  (children : any, reducer : (result: ?mixed, item: any, index: number) => any, initialValue : any) : any =>
    children ? paint(children.reduce(reducer, initialValue)) : undefined

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

export const only =
  (children : any = []) : any => {
    if(isEmpty(children)) {
      throw new Error('No Children present in Component')
    } else if(hasMultiple(children)) {
      throw new Error('Multiple Children present in Component')
    }
    return children.shift()
  }

export const onlyComposed =
  (children : any = []) : any =>
    compose(children)
      .then(composedChildren => {
        composedChildren = filterOutUndefined(composedChildren)
        if(isEmpty(composedChildren)) {
          return Promise.reject(new Error('No Children present in Component after composition'))
        } else if(hasMultiple(composedChildren)) {
          return Promise.reject(new Error('Multiple Children present in Component after composition'))
        }
        return composedChildren.shift()
      })
      
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
  forEach,
  reduce,
  spread,
  only,
  onlyComposed,
  reduceComposed,
  cloneWithProps
}
