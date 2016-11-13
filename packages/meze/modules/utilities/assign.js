import { Component } from '../Component'
import { isComponentInstance } from '../ComponentInstance'
import isPlainObject from 'lodash.isplainobject'

const getKeyForChild = (child, index) => (
  isComponentInstance(child) || !isPlainObject(child)
  ? index
  : false
)

const toKeyedObject = (key, child) => key === false
  ? child
  : { [key]: child }

export const assign = (children = []) =>
  children.reduce((result, child, index) =>
    Object.assign(
      result,
      toKeyedObject(getKeyForChild(child, index), child)
    ),
  {})

export const Assign = Component(({ children }) => {
  return assign(children.toArray())
})

export default {
  assign,
  Assign
}
