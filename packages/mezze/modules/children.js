import { Component } from './Component'
import isPlainObject from 'lodash.isplainobject'

export const Assign = Component(function (props) {
  const { children } = props
  return children.reduce((result, child, index) => {
    return Object.assign(result, isPlainObject(child)
      ? child
      : { [index]: child }
    )
  }, {})
})

export default {
  Assign
}
