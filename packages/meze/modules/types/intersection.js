import chainableTypeChecker from './chainableTypeChecker'
import { PropTypeLocationNames } from './PropTypes'

const validateAll = typeValidators => (props, prop, component, location) =>
  typeValidators
    .reduce((validity, typeValidator) => {
      if (validity === true) {
        const check = typeValidator(props, prop, component, location)
        if (check instanceof Error) {
          return check
        }
      }
      return validity
    }, true)

const onRequirementFailed = (props, propName, componentName, location, propFullName) =>
  new Error(
    `Required ${PropTypeLocationNames[location]} \`${propFullName}\` was not specified in \`${componentName}\`.`
  )

export default (...types) => chainableTypeChecker(validateAll(types), onRequirementFailed)
