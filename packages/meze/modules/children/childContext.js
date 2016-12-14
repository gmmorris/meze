/* @flow */
import type { ComponentMountingContext } from '../ComponentInstance'

import symbolPainter from '../utilities/symbolPainter'
import compose from '../compose'

const { paint: withContext, painted: hasContext, paintedBy: getContext } = symbolPainter('ChildrenArray$context')

export default {
  withContext,
  hasContext,
  getContext
}

export function contextualCompose (children : Iterable<any>, context : ?ComponentMountingContext = getContext(children)) {
  const compositionMethod = (context && context.compose ? context.compose : compose)
  return compositionMethod(Array.from(children), context)
}
