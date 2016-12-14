/* @flow */
import type { ComponentMountingContext } from '../ComponentInstance'
import type { Paintable } from '../utilities/symbolPainter'

import symbolPainter from '../utilities/symbolPainter'
import compose from '../compose'
import { isChildren } from './Children'
import type Children from './Children'

const { paint: withContext, painted: hasContext, paintedBy: getContext } = symbolPainter('ChildrenArray$context')

export default {
  withContext,
  hasContext,
  getContext
}

export const copyPaintingFromOriginToTarget = (origin : Children, target : Children) : Children => {
  if (hasContext(origin)) {
    target = withContext(target, getContext(origin))
  }
  return target
}

export function contextualCompose (children : Children, context : ?ComponentMountingContext = getContext(children)) {
  const compositionMethod = (context && context.compose ? context.compose : compose)
  return compositionMethod(children.toArray(), context)
}

export const setContext =
  (children? : Paintable, context? : any) : ?Paintable => children && isChildren(children)
    ? withContext(children, context)
    : children
