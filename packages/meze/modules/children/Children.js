/* @flow */
import type { ComponentMountingContext } from '../ComponentInstance'

import childContext from './childContext'

const { withContext, hasContext, getContext } = childContext

export default function Children (children : Iterable<*> = []) {
  this.children = Array.from(children)
  this.length = this.children.length
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
  },
  // OMG, double iterator! Why? Because Flow is slightly broken :(
  // and doesn't know about Symbols yet... but it's ok Flow, we <3 you anyway
  // https://github.com/facebook/flow/issues/1059
  ['@@iterator'] () : Iterator<any> {
    return this.children[Symbol.iterator]()
  }
}

export const asChildren = (children : Iterable<*>) : Children =>
  children instanceof Children
    ? children
    : new Children(children)

export const isChildren =
  (children : ?any) : boolean =>
    children instanceof Children
