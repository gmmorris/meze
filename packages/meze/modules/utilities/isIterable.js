/* @flow */
import isFunction from 'lodash.isfunction'

export default (obj : Object) : boolean => obj && isFunction(obj[Symbol.iterator])
