/* @flow */
import { isChildrenOf } from './childrenOf'

import chainableTypeChecker from './chainableTypeChecker'
import { PropTypeLocationNames } from './PropTypes'

const onRequirementFailed = (props : Object, prop : string, component : string, location : string, propFullName : string) : Error =>
  new Error(
    `Required ${PropTypeLocationNames[location]} \`${propFullName}\` was not specified in \`${component}\`.`
  )

export default (validator : Function) : Function =>
  chainableTypeChecker(isChildrenOf([validator]), onRequirementFailed)
