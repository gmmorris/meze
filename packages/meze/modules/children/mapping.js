/* @flow */
import isFunction from 'lodash.isfunction'
import { identity } from '../utilities/helpers'

import type { ComponentMountingContext } from '../ComponentInstance'

import { isComponentInstance } from '../ComponentInstance'
import Children, { asArray, asChildren, contextualCompose, copyPaintingFromOriginToTarget } from './Children'

// api
export const mapToArray =
  (children : Children | any[], mapper : (item: any, index: number) => any = identity) : any[] => {
    return asArray(children).map(mapper)
  }

export const map =
  (children : Children | any[], mapper : (item: any, index: number) => any = identity) : Children => {
    const mappedChildren : Children = new Children(asArray(children).map(mapper))
    return Array.isArray(children)
      ? mappedChildren
      : copyPaintingFromOriginToTarget(children, mappedChildren)
  }

const isMappable = composition => composition && isFunction(composition.map)
export const mapComposed =
  (children : Children | any[], mapper : (item: any, index: number) => any = identity, context : ?ComponentMountingContext) : any =>
    contextualCompose(asChildren(children), context)
      .then(composedChildren => mapper && isMappable(composedChildren)
        ? composedChildren.map(mapper)
        : composedChildren)

export const forEach =
  (children : Children | any[], mapper : (item: any, index: number) => any = identity) : void =>
    asArray(children).forEach(mapper)

export const cloneWithProps =
  (children : Children | any[], props : Object | () => Object) : Children =>
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
