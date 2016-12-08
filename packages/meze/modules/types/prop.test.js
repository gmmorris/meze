import test from 'ava'

import propValidator from './prop'

test('prop validates that a prop on a props object is an object that passes a custom validator function', t => {
  const location = 'composition'
  const props = { a: {} }
  const prop = 'a'
  const component = 'MyComponent'

  const validator = (propsArg, propArg, componentArg) => {
    t.deepEqual(props, propsArg)
    t.deepEqual(propArg, prop)
    t.deepEqual(componentArg, component)
    return true
  }

  t.deepEqual(
    propValidator(validator)(props, prop, component, location),
    true
  )
})

test('prop exposes an isRequired method which returns an error if the prop is missing', t => {
  const location = 'prop'
  const props = { a: {} }
  const prop = 'b'
  const component = 'MyComponent'

  const validator = (propsArg, propArg, componentArg) => {
    return true
  }

  const result = propValidator(validator).isRequired(props, prop, component, location)

  t.truthy(
    result instanceof Error
  )

  t.deepEqual(
    result.message,
    'Required prop `b` was not specified in `MyComponent`.'
  )
})
