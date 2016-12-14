/* @flow */
import isArray from 'lodash.isarray'
import { isChildren } from '../children/Children'
import isIterable from './isIterable'

export default (obj : Object) : boolean => obj &&
  (isChildren(obj) || isArray(obj)) &&
  isIterable(obj)
