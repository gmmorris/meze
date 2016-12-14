/* @flow */
import type { ComponentMountingContext } from '../ComponentInstance'

import childContext from './childContext'

const { withContext, hasContext, getContext } = childContext

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
  [Symbol.iterator] () : Iterator<any> {
    return this.children[Symbol.iterator]()
  }
}

export const asChildren = (children : Children | any[] = []) : Children =>
  Array.isArray(children)
    ? new Children(children)
    : children

export const isChildren =
  (children : ?any) : boolean =>
    children instanceof Children
