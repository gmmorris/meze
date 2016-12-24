/* @flow */
import isFunction from 'lodash.isfunction'

import { isError } from '../utilities/validations'
import { reduce } from '../children/reduction'
import { isChildren } from '../children/Children'

import chainableTypeChecker from './chainableTypeChecker'
import { PropTypeLocationNames } from './PropTypes'

export const isChildrenOf = (validators : Array<Function>) : Function =>
  (props : Object, prop : string, component : string, location : string) : boolean | Error =>
    isChildren(props[prop])
    ? props[prop].length === validators.length
      ? reduce(props[prop], (validity, child, index) => isError(validity)
          ? validity
          : isFunction(validators[index])
            ? validators[index]({ [prop]: child }, prop, component, location)
            : new Error(`${PropTypeLocationNames[location]} Child at index \`${index}\` was not a valid type.`)
        , null)
      : new Error(`${PropTypeLocationNames[location]} Children contains an incorrect number of children.`)
    : new Error(`${PropTypeLocationNames[location]} \`${prop}\` is not a Children type.`)

const onRequirementFailed = (props : Object, prop : string, component : string, location : string, propFullName : string) : Error =>
  new Error(
    `Required ${PropTypeLocationNames[location]} \`${propFullName}\` was not specified in \`${component}\`.`
  )

export default (...validators : Array<Function>) : Function =>
  chainableTypeChecker(isChildrenOf(validators), onRequirementFailed)
