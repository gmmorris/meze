import compose from '../compose'
import { Component } from '../Component'
import { isChildrenArray } from '../Children'
import isObjectLike from 'lodash.isobjectlike'
import isPlainObject from 'lodash.isplainobject'
import createComponent from '../createComponent'
import { Assign } from './assign'
import symbolPainter from '../utilities/symbolPainter'
import { isString } from './validations'

import type { ComponentMountingContext } from '../ComponentInstance'

function contextualCompose (component, context? : ComponentMountingContext) {
  const compositionMethod = (context && context.compose ? context.compose : compose)
  return compositionMethod(component, context)
}

const { paint, painted, paintedBy } = symbolPainter('objectify$key')

export const isPlainObjectComponent = component => painted(component)

export const getPlainObjectComponentKey = component => paintedBy(component)

function namePlainObjectComponents (obj) {
  return !isObjectLike(obj)
  ? obj
  : Object.keys(obj).reduce((result, prop, index) => {
    if (isPlainObjectComponent(obj[prop])) {
      result[getPlainObjectComponentKey(obj[prop]) || prop] = obj[prop]
    } else if (isPlainObject(obj[prop])) {
      Object.assign(result, obj[prop])
    } else {
      result[prop] = obj[prop]
    }
    return result
  }, {})
}

export const objectify = (name) => (props, context) => {
  const { children = [], ...rest } = props
  return contextualCompose(createComponent(Assign, {}, rest, ...(isChildrenArray(children) ? children.toArray() : children)), context)
    .then(res => paint(namePlainObjectComponents(res), name))
}

export const createObjectify = name => Component(objectify(name))

export const Objectify = createObjectify(null)
export const objectifyMiddleware = candidate => isString(candidate) ? createObjectify(candidate) : null

