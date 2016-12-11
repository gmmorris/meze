/* @flow */
import isArray from 'lodash.isarray'

import type { ComponentMountingContext } from '../ComponentInstance'

import symbolPainter from '../utilities/symbolPainter'
import type { Paintable } from '../utilities/symbolPainter'
import compose from '../compose'

const { paint: withContext, painted: hasContext, paintedBy: getContext } = symbolPainter('ChildrenArray$context')

export const copyPaintingFromOriginToTarget = (origin : Children, target : Children) : Children => {
  if (hasContext(origin)) {
    target = withContext(target, getContext(origin))
  }
  return target
}

export function contextualCompose (children : Children, context : ?ComponentMountingContext = getContext(children)) {
  const compositionMethod = (context && context.compose ? context.compose : compose)
  return compositionMethod(children.children, context)
}

type ChildrenType = {
  children: any[],
  length: number
} & Paintable

export type ChildrenArray =
  ChildrenType &
  {
    withContext: Function,
    getContext: Function,
    toArray: Function
  }

export default function Children (children : any[]) : ChildrenType {
  this.children = children
  this.length = children.length
  return this
}

Children.prototype = {
  withContext (context) : Children {
    return withContext(new Children(this.children), context)
  },
  getContext () : ?ComponentMountingContext {
    return hasContext(this) ? getContext(this) : undefined
  },
  toArray () : any[] {
    return this.children
  },
  [Symbol.iterator] () : any {
    return this.children[Symbol.iterator]()
  }
}

export const asArray = (children : Children | any[] = []) : any[] =>
  Array.isArray(children) ? children : (isChildren(children) ? children.toArray() : [])

// api
export const asChildren = (children : Children | any[] = []) : Children =>
  Array.isArray(children) ? new Children(children) : children

// internal
export const isChildren =
  (children : ?any) : boolean =>
    children instanceof Children

export const setContext =
  (children? : Paintable, context? : any) : ?Paintable => children && isChildren(children)
    ? withContext(children, context)
    : children

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

export function spreadChildren (children : ?any[]) : ?ChildrenArray {
  if (children) {
    return new Children(flattenNestedChildArrays(children))
  }
  return children
}
