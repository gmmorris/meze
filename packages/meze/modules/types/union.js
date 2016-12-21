import PropTypes from 'proptypes'

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
