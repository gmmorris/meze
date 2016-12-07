import chainableTypeChecker from './chainableTypeChecker'
import { PropTypeLocationNames } from './PropTypes'

const isIterableValidator = (props, prop, component, location) =>
  !!(props[prop] && props[prop][Symbol.iterator])

const onRequirementFailed = (props, propName, componentName, location, propFullName) =>
  new Error(
    `Required ${PropTypeLocationNames[location]} \`${propFullName}\` was not specified in \`${componentName}\`.`
  )

export default chainableTypeChecker(isIterableValidator, onRequirementFailed)
