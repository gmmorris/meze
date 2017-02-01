import chainableCompositTypeChecker from './chainableCompositTypeChecker'
import { PropTypeLocationNames } from './PropTypes'

const onRequirementFailed = (composition, componentName, location) =>
  new Error(
    `Required \`${PropTypeLocationNames[location]}\` of \`${componentName}\` failed to resulted in the custom type`
  )

export default validator => chainableCompositTypeChecker(validator, onRequirementFailed)
