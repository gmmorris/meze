import test from 'ava'
import { spy } from 'sinon'

import intersection from './intersection'

test('intersection validates that a prop on a props object is of all the types sent as arguments', t => {
  const location = 'composition'
  const props = { musician: { name: 'Jonathan', age: 35 } }
  const prop = 'musician'
  const component = 'MyComponent'

  const validatorPassing1 = spy(() => true)
  const validatorPassing2 = spy(() => true)
  const validatorFailing = spy(() => new Error(''))

  t.deepEqual(
    intersection(validatorPassing1, validatorPassing2)(props, prop, component, location),
    true
  )

  t.truthy(validatorPassing1.calledOnce)
  t.truthy(validatorPassing2.calledOnce)

  t.truthy(
    intersection(validatorPassing1, validatorFailing)(props, prop, component, location) instanceof Error
  )

  t.truthy(validatorPassing1.calledTwice)
  t.truthy(validatorFailing.calledOnce)

  t.truthy(
    intersection(validatorPassing1, validatorFailing, validatorPassing2)(props, prop, component, location) instanceof Error
  )

  t.truthy(validatorPassing1.calledThrice)
  t.truthy(validatorFailing.calledTwice)
  t.truthy(validatorPassing2.calledOnce)
})

test('intersection exposes an isRequired method which returns an error if the prop is missing', t => {
  const location = 'prop'
  const props = { a: { } }
  const prop = 'b'
  const component = 'MyComponent'

  const result = intersection([() => true]).isRequired(props, prop, component, location)
  t.truthy(
    result instanceof Error
  )

  t.deepEqual(
    result.message,
    'Required prop `b` was not specified in `MyComponent`.'
  )
})
