/* @flow */
import isFunction from 'lodash.isfunction'
import { identity } from '../utilities/helpers'

import type { ComponentMountingContext } from '../ComponentInstance'
// import type { ChildrenArray } from './Children'

import { isComponentInstance } from '../ComponentInstance'
import ChildrenArray, { asArray, asChildren, contextualCompose, copyPaintingFromOriginToTarget } from './Children'

// api
export const mapToArray =
  (children : ChildrenArray | any[], mapper : (item: any, index: number) => any = identity) : any[] =>
    asArray(children).map(mapper)

export const map =
  (children : ChildrenArray | any[], mapper : (item: any, index: number) => any = identity) : ChildrenArray => {
    const mappedChildren : ChildrenArray = new ChildrenArray(asArray(children).map(mapper))
    return Array.isArray(children)
      ? mappedChildren
      : copyPaintingFromOriginToTarget(children, mappedChildren)
  }

const isMappable = composition => composition && isFunction(composition.map)
export const mapComposed =
  (children : ChildrenArray | any[], mapper : (item: any, index: number) => any = identity, context : ?ComponentMountingContext) : any =>
    contextualCompose(asChildren(children), context)
      .then(composedChildren => mapper && isMappable(composedChildren)
        ? composedChildren.map(mapper)
        : composedChildren)

export const forEach =
  (children : ChildrenArray | any[], mapper : (item: any, index: number) => any = identity) : void =>
    asArray(children).forEach(mapper)

export const cloneWithProps =
  (children : ChildrenArray | any[], props : Object | () => Object) : ChildrenArray =>
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
