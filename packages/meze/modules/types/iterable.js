/* @flow */
import isobjectlike from 'lodash.isobjectlike'

import chainableTypeChecker from './chainableTypeChecker'
import { PropTypeLocationNames } from './PropTypes'
import isIterable from '../utilities/isIterable'

const isIterableValidator = (props : Object, prop : string, component : string, location : string) =>
  isobjectlike(props[prop]) && isIterable(props[prop])

const onRequirementFailed = (props : Object, prop : string, component : string, location : string, propFullName : string) : Error =>
  new Error(
    `Required ${PropTypeLocationNames[location]} \`${propFullName}\` was not specified in \`${component}\`.`
  )

export default chainableTypeChecker(isIterableValidator, onRequirementFailed)
