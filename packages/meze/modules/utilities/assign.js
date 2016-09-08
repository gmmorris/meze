import { Component } from '../Component'
import { isComponentInstance } from '../ComponentInstance'
import isPlainObject from 'lodash.isplainobject'

export const assign = children =>
  children.reduce((result, child, index) =>
    Object.assign(
      result,
      isComponentInstance(child) || !isPlainObject(child)
      ? { [index]: child }
      : child
    ),
  {})

export const Assign = Component(({ children }) => assign(children))

export default {
  assign,
  Assign
}
