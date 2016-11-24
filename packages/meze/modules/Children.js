/* @flow */
import isFunction from 'lodash.isfunction'
import isObjectLike from 'lodash.isobjectlike'
import isArray from 'lodash.isarray'

import symbolPainter from './internals/symbolPainter'
import type { Paintable } from './internals/symbolPainter'
import { identity, isEmpty, hasMultiple, filterOutUndefined } from './utilities/helpers'

import compose from './compose'
import { isComponentInstance } from './ComponentInstance'

const { paint, painted } = symbolPainter('ChildrenArray')
const { paint: withContext, painted: hasContext, paintedBy: getContext } = symbolPainter('ChildrenArray$context')

import type { ComponentMountingContext } from './ComponentInstance'

function contextualCompose (children : ChildrenArray, context : ?ComponentMountingContext = getContext(children)) {
  const compositionMethod = (context && context.compose ? context.compose : compose)
  return compositionMethod(children.children, context)
}

export type ChildrenArray = {
  children: any[],
  withContext: Function,
  getContext: Function,
  toArray: Function
} & Paintable

export function Children (children : any[]) : ChildrenArray {
  this.children = children
  return paint(this)
}

Children.prototype = {
  withContext (context) : ChildrenArray {
    return withContext(new Children(this.children), context)
  },
  getContext () : ?ComponentMountingContext {
    return hasContext(this) ? getContext(this) : undefined
  },
  toArray () : any[] {
    return this.children
  }
}

// api
export const asChildren = (children : ChildrenArray | any[] = []) : ChildrenArray =>
  Array.isArray(children) ? new Children(children) : children
const asArray = (children : ChildrenArray | any[] = []) : any[] =>
  Array.isArray(children) ? children : (isChildrenArray(children) ? children.toArray() : [])

export const mapToArray =
  (children : ChildrenArray | any[], mapper : (item: any, index: number) => any = identity) : any[] =>
    asArray(children).map(mapper)

export const map =
  (children : ChildrenArray | any[], mapper : (item: any, index: number) => any = identity) : ChildrenArray => {
    const mappedChildren = new Children(asArray(children).map(mapper))
    return Array.isArray(children)
      ? mappedChildren
      : copyPaintingFromOriginToTarget(children, mappedChildren)
  }

const isMappable = composition => composition && isFunction(composition.map)
export const mapComposed =
  (children : ChildrenArray | any[], mapper : (item: any, index: number) => any = identity, context : ?ComponentMountingContext) : any =>
    contextualCompose(asChildren(children), context)
      .then(composedChildren => mapper && isMappable(composedChildren)
        ? composedChildren.map(mapper)
        : composedChildren)

export const forEach =
  (children : ChildrenArray | any[], mapper : (item: any, index: number) => any = identity) : void =>
    asArray(children).forEach(mapper)

export const reduce =
  (children : ChildrenArray | any[], reducer : (result: ?mixed, item: any, index: number) => any, initialValue : any) : any =>
    asArray(children).reduce(reducer, initialValue)

export const cloneWithProps =
  (children : ChildrenArray | any[], props : Object | () => Object) : ChildrenArray =>
    map(children, child =>
      isComponentInstance(child)
        ? child.clone(typeof props === 'function' ? props(child.props) : props)
        : child
    )

type CompositionReducer = (result: ?mixed, item: any, index: number) => any
const isReduceable = composition => composition && isFunction(composition.reduce)

export const reduceComposed =
  (children : ChildrenArray | any[], reducer : CompositionReducer, initialValue : ?any, context : ?ComponentMountingContext) : any =>
    contextualCompose(asChildren(children), context)
      .then(composedChildren => reducer && isReduceable(composedChildren)
        ? composedChildren.reduce(reducer, initialValue)
        : composedChildren)

export const only =
  (children : ChildrenArray | any[]) : any => {
    const childrenAsArray = asArray(children)
    if (isEmpty(childrenAsArray)) {
      throw new Error('No Children present in Component')
    } else if (hasMultiple(childrenAsArray)) {
      throw new Error('Multiple Children present in Component')
    }
    return childrenAsArray.shift()
  }

export const onlyComposed =
  (children : ChildrenArray, context : ?ComponentMountingContext) : any =>
    contextualCompose(asChildren(children), context)
        .then(composedChildren => {
          composedChildren = filterOutUndefined(composedChildren)
          if (isEmpty(composedChildren)) {
            return Promise.reject(new Error('No Children present in Component after composition'))
          } else if (hasMultiple(composedChildren)) {
            return Promise.reject(new Error('Multiple Children present in Component after composition'))
          }
          return composedChildren.shift()
        })

// internal

export const isChildrenArray =
  (children : ?any) : boolean =>
    children && (isObjectLike(children) || isFunction(children)) ? painted(children) : false

export const setContext =
  (children? : Paintable, context? : any) : ?Paintable => children && isChildrenArray(children)
    ? withContext(children, context)
    : children

const copyPaintingFromOriginToTarget = (origin : ChildrenArray, target : ChildrenArray) : ChildrenArray => {
  if (hasContext(origin)) {
    target = withContext(target, getContext(origin))
  }
  return paint(target)
}

function flattenNestedChildArrays (children : any[]) : any[] {
  let index = -1
  let length = children.length

  while (++index < length) {
    let child = children[index]
    if (isChildrenArray(child)) {
      children.splice(index, 1, ...child.toArray())
      length += (child.length - 1)
    } else if (isArray(child)) {
      children.splice(index, 1, ...child)
      length += (child.length - 1)
    }
  }
  return children
}

export function spreadChildren (children : ?any[]) : ?ChildrenArray {
  if (children) {
    return new Children(flattenNestedChildArrays(children))
  }
  return children
}

// public API
export default {
  map,
  mapToArray,
  forEach,
  reduce,
  only,
  onlyComposed,
  reduceComposed,
  cloneWithProps
}
