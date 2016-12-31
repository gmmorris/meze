/* @flow */
import { asChildren } from './Children'
import asArray from '../utilities/asArray'

export const filter =
  (children : Iterable<*> | any[], pred : Function) : any => {
    return asChildren(asArray(children).filter(pred))
  }

export default {
  filter
}
