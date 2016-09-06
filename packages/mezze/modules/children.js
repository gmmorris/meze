import { Component } from './Component'
import isPlainObject from 'lodash.isplainobject'

export const assign = children =>
  children.reduce((result, child, index) =>
    Object.assign(
      result,
      isPlainObject(child) ? child : { [index]: child }
    ),
  {})


export const Assign = Component(({ children }) => assign(children))

export default {
  assign,
  Assign
}
