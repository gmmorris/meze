// import chainableTypeChecker from './chainableTypeChecker'
// import { oneOfType, PropTypeLocationNames } from './PropTypes'
import PropTypes from 'proptypes'
// const validateAtLeastOne = typeValidators => (props, prop, component, location) => {
//   const failedValidators = typeValidators
//     .reduce((errors, typeValidator) => {
//       const check = typeValidator(props, prop, component, location)
//       if (check instanceof Error) {
//         errors.push(check)
//       }
//       return errors
//     }, [])

//   if (failedValidators.length === typeValidators.length) {
//     return new Error(
//       failedValidators
//         .map(error => error.message)
//         .join(' ')
//     )
//   }
//   return true
// }


// const onRequirementFailed = (props, propName, componentName, location, propFullName) =>
//   new Error(
//     `Required ${PropTypeLocationNames[location]} \`${propFullName}\` was not specified in \`${componentName}\`.`
//   )

// export default (...types) => chainableTypeChecker(validateAtLeastOne(types), onRequirementFailed)
export default (...types) => {
  const validator = PropTypes.oneOfType(types)
  const checker = (props, prop, component, location) => {
    const result = validator(props, prop, component, location)
    if (result instanceof Error) {
      return result
    }
    return true
  }
  checker.isRequired = validator.isRequired
  return checker
}
