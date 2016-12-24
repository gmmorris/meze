/* @flow */
import { isComponentInstance } from '../ComponentInstance'

import chainableTypeChecker from './chainableTypeChecker'
import { PropTypeLocationNames } from './PropTypes'

const isIterableValidator = (props : Object, prop : string, component : string, location : string) =>
  isComponentInstance(props[prop])
    ? null
    : new Error(
      `${PropTypeLocationNames[location]} \`${prop}\` was not a \`component\`.`
    )

const onRequirementFailed = (props : Object, prop : string, component : string, location : string, propFullName : string) : Error =>
  new Error(
    `Required ${PropTypeLocationNames[location]} \`${propFullName}\` was not specified in \`${component}\`.`
  )

export default chainableTypeChecker(isIterableValidator, onRequirementFailed)
