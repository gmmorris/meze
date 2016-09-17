import { Component } from '../Component'
import isObjectLike from 'lodash.isobjectlike'
import createComponent from '../createComponent'
import { Assign } from './assign'
import symbolPainter from '../internals/symbolPainter'

const { paint, painted, paintedBy } = symbolPainter('objectify$key')

export const isPlainObjectComponent = component => painted(component)

export const getPlainObjectComponentKey = component => paintedBy(component)

function namePlainObjectComponents (obj) {
  return !isObjectLike(obj)
  ? obj
  : Object.keys(obj).reduce((result, prop, index) => {
    if (isPlainObjectComponent(obj[prop])) {
      result[getPlainObjectComponentKey(obj[prop]) || prop] = obj[prop]
    } else {
      result[prop] = obj[prop]
    }
    return result
  }, {})
}

export const objectify = (name) => (props) => {
  // console.log(JSON.stringify(props))
  const { children = [], ...rest } = props
  return createComponent(Assign, {}, rest, ...children)
    .enableMiddleware()
    .then(res => paint(namePlainObjectComponents(res), name))
}

export const createObjectify = name => Component(objectify(name))
export const Objectify = createObjectify(null)

