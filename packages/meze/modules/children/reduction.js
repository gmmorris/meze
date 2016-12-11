/* @flow */
import isFunction from 'lodash.isfunction'

import type { ComponentMountingContext } from '../ComponentInstance'

import ChildrenArray, { asChildren, contextualCompose, asArray } from './Children'
// import type { ChildrenArray } from './Children'

type CompositionReducer = (result: ?mixed, item: any, index: number) => any
const isReduceable = composition => composition && isFunction(composition.reduce)

export const reduce =
  (children : ChildrenArray | any[], reducer : (result: ?mixed, item: any, index: number) => any, initialValue : any) : any =>
    asArray(children).reduce(reducer, initialValue)

export const reduceComposed =
  (children : ChildrenArray | any[], reducer : CompositionReducer, initialValue : ?any, context : ?ComponentMountingContext) : any =>
    contextualCompose(asChildren(children), context)
      .then(composedChildren => reducer && isReduceable(composedChildren)
        ? composedChildren.reduce(reducer, initialValue)
        : composedChildren)

export default {
  reduce,
  reduceComposed
}
