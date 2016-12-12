/* @flow */
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

export default function Children (children : any[]) {
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
