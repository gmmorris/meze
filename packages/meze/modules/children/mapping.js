/* @flow */
import isFunction from 'lodash.isfunction'
import { identity } from '../utilities/helpers'

import type { ComponentMountingContext } from '../ComponentInstance'
import type Children from './Children'

import { isComponentInstance } from '../ComponentInstance'
import { asChildren } from './Children'
import childContext, { contextualCompose } from './childContext'
import asArray from '../utilities/asArray'

const { hasContext, withContext, getContext } = childContext
// api
export const mapToArray =
  (children : Iterable<any>, mapper : (item: any, index: number) => any = identity) : any[] => {
    return asArray(children).map(mapper)
  }

export const map =
  (children : Iterable<any>, mapper : (item: any, index: number) => any = identity) : Children => {
    const mappedChildren : Children = asChildren(mapToArray(children, mapper))
    return hasContext(children)
      ? withContext(mappedChildren, getContext(children))
      : mappedChildren
  }

const isMappable = composition => composition && isFunction(composition.map)
export const mapComposed =
  (children : Iterable<any>, mapper : (item: any, index: number) => any = identity, context : ?ComponentMountingContext) : any =>
    contextualCompose(asChildren(children), context)
      .then(composedChildren => mapper && isMappable(composedChildren)
        ? composedChildren.map(mapper)
        : composedChildren)

export const forEach =
  (children : Iterable<any>, mapper : (item: any, index: number) => any = identity) : void =>
    asArray(children).forEach(mapper)

export const cloneWithProps =
  (children : Iterable<any>, props : Object | () => Object) : Children =>
    map(children, child =>
      isComponentInstance(child)
        ? child.clone(typeof props === 'function' ? props(child.props) : props)
        : child
    )

export default {
  map,
  mapToArray,
  mapComposed,
  forEach,
  cloneWithProps
}
