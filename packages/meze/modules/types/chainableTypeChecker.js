import { isNullOrUndefined } from '../utilities/validations'

var ANONYMOUS = '<<anonymous>>'

export default function (validator, onRequirementFailed) {
  function checkType (
    isRequired,
    props,
    propName,
    componentName = ANONYMOUS,
    location,
    propFullName = propName
  ) {
    if (!isNullOrUndefined(props[propName])) {
      return validator(props, propName, componentName, location, propFullName)
    } else if (isRequired) {
      return onRequirementFailed(props, propName, componentName, location, propFullName)
    }
  }

  var chainedCheckType = checkType.bind(null, false)
  chainedCheckType.isRequired = checkType.bind(null, true)

  return chainedCheckType
}
