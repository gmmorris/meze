import { Component } from './Component'
import { isComponentInstance } from './ComponentInstance'
import isPlainObject from 'lodash.isplainobject'

export const map = (children, mapper) =>
  children.map(child => mapper(child))

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
  Assign,
  map
}
