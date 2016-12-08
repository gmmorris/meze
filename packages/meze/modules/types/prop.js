import chainableTypeChecker from './chainableTypeChecker'
import { PropTypeLocationNames } from './PropTypes'

const onRequirementFailed = (props, propName, componentName, location, propFullName) =>
  new Error(
    `Required ${PropTypeLocationNames[location]} \`${propFullName}\` was not specified in \`${componentName}\`.`
  )

export default validator => chainableTypeChecker(validator, onRequirementFailed)
