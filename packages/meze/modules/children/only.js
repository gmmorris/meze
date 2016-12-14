/* @flow */
import { isEmpty, hasMultiple, filterOutUndefined } from '../utilities/helpers'

import type { ComponentMountingContext } from '../ComponentInstance'

import { asChildren } from './Children'
import { contextualCompose } from './childContext'
import asArray from '../utilities/asArray'

export const only =
  (children : Iterable<*> | any[]) : any => {
    const childrenAsArray = asArray(children)
    if (isEmpty(childrenAsArray)) {
      throw new Error(`No Children present in Component`)
    } else if (hasMultiple(childrenAsArray)) {
      throw new Error('Multiple Children present in Component')
    }
    return childrenAsArray.shift()
  }

export const onlyComposed =
  (children : Iterable<*>, context : ?ComponentMountingContext) : any =>
    contextualCompose(asChildren(children), context)
      .then(composedChildren => {
        composedChildren = filterOutUndefined(composedChildren)
        if (isEmpty(composedChildren)) {
          return Promise.reject(new Error('No Children present in Component after composition'))
        } else if (hasMultiple(composedChildren)) {
          return Promise.reject(new Error('Multiple Children present in Component after composition'))
        }
        return composedChildren.shift()
      })

export default {
  only,
  onlyComposed
}
