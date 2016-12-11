/* @flow */
import isFunction from 'lodash.isfunction'

import type { ComponentMountingContext } from '../ComponentInstance'

import Children, { asChildren, contextualCompose, asArray } from './Children'

type CompositionReducer = (result: ?mixed, item: any, index: number) => any
const isReduceable = composition => composition && isFunction(composition.reduce)

export const reduce =
  (children : Children | any[], reducer : (result: ?mixed, item: any, index: number) => any, initialValue : any) : any =>
    asArray(children).reduce(reducer, initialValue)

export const reduceComposed =
  (children : Children | any[], reducer : CompositionReducer, initialValue : ?any, context : ?ComponentMountingContext) : any =>
    contextualCompose(asChildren(children), context)
      .then(composedChildren => reducer && isReduceable(composedChildren)
        ? composedChildren.reduce(reducer, initialValue)
        : composedChildren)

export default {
  reduce,
  reduceComposed
}
