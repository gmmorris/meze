import { isNullOrUndefined } from '../utilities/validations'

var ANONYMOUS = '<<anonymous>>'

export default function (validator, onRequirementFailed) {
  function checkType (
    isRequired,
    composition,
    componentName = ANONYMOUS,
    location
  ) {
    if (!isNullOrUndefined(composition)) {
      return validator(composition, componentName, location)
    } else if (isRequired) {
      return onRequirementFailed(composition, componentName, location)
    }
  }

  var chainedCheckType = checkType.bind(null, false)
  chainedCheckType.isRequired = checkType.bind(null, true)

  return chainedCheckType
}
