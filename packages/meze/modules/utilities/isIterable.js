/* @flow */
import isFunction from 'lodash.isfunction'

export default (obj : Object) : boolean => isFunction(obj[Symbol.iterator])
