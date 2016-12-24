/* @flow */
import isFunction from 'lodash.isfunction'

import { isError } from '../utilities/validations'
import { reduce } from '../children/reduction'
import { isChildren } from '../children/Children'

import chainableTypeChecker from './chainableTypeChecker'
import { PropTypeLocationNames } from './PropTypes'

export const isChildrenOf = (validator : Function) : Function =>
  (props : Object, prop : string, component : string, location : string) : boolean | Error =>
    isChildren(props[prop])
    ? reduce(props[prop], (validity, child, index) => isError(validity)
        ? validity
        : isFunction(validator)
          ? validator({ [prop]: child }, prop, component, location)
          : new Error(`${PropTypeLocationNames[location]} Child at index \`${index}\` was not a valid type.`)
      , true)
    : new Error(`${PropTypeLocationNames[location]} \`${prop}\` is not a Children type.`)

const onRequirementFailed = (props : Object, prop : string, component : string, location : string, propFullName : string) : Error =>
  new Error(
    `Required ${PropTypeLocationNames[location]} \`${propFullName}\` was not specified in \`${component}\`.`
  )

export default (validator : Function) : Function =>
  chainableTypeChecker(isChildrenOf(validator), onRequirementFailed)