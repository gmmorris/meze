import test from 'ava'
import { spy } from 'sinon'

import union from './union'

test('union validates that a prop on a props object is of at least one of the types sent as arguments', t => {
  const location = 'composition'
  const props = { prop: { name: 'Jonathan', age: 35 } }
  const prop = 'prop'
  const component = 'MyComponent'

  const validatorPassing1 = spy(() => {})
  const validatorPassing2 = spy(() => {})
  const validatorFailing1 = spy(() => new Error('first error.'))
  const validatorFailing2 = spy(() => new Error('second error.'))

  t.deepEqual(
    union(validatorPassing1, validatorPassing2)(props, prop, component, location),
    true
  )

  t.truthy(validatorPassing1.calledOnce)
  t.truthy(validatorPassing2.notCalled)

  t.deepEqual(
    union(validatorPassing1, validatorFailing1)(props, prop, component, location),
    true
  )

  t.truthy(validatorPassing1.calledTwice)
  t.truthy(validatorFailing1.notCalled)

  const res = union(validatorFailing1, validatorFailing2)(props, prop, component, location)
  t.truthy(
     res instanceof Error
  )
  t.deepEqual(
    res.message,
    'Invalid undefined `prop` supplied to `MyComponent`.'
  )

  t.truthy(validatorFailing1.calledOnce)
  t.truthy(validatorFailing2.calledOnce)
})

test('union exposes an isRequired method which returns an error if the prop is missing', t => {
  const location = 'prop'
  const props = { a: { } }
  const prop = 'b'
  const component = 'MyComponent'

  const result = union([() => true]).isRequired(props, prop, component, location)
  t.truthy(
    result instanceof Error
  )

  t.deepEqual(
    result.message,
    'Required prop `b` was not specified in `MyComponent`.'
  )
})
