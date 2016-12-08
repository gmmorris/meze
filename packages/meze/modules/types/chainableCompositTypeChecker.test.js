import test from 'ava'
import { spy } from 'sinon'

import chainableCompositTypeChecker from './chainableCompositTypeChecker'

test('chainableCompositTypeChecker creates a function which calls the validator', t => {
  const validator = spy(() => true)

  const location = 'composition'
  const composition = { a: 1 }
  const component = 'MyComponent'

  const result = chainableCompositTypeChecker(validator)

  t.deepEqual(
    result(composition, component, location),
    true
  )

  t.deepEqual(
    validator.args[0][0],
    composition
  )
  t.deepEqual(
    validator.args[0][1],
    component
  )
  t.deepEqual(
    validator.args[0][2],
    location
  )
})

test('chainableCompositTypeChecker add an isRequired method which set the composition as required', t => {
  const validator = spy(() => true)

  const location = 'composition'
  const result = chainableCompositTypeChecker(validator)

  t.deepEqual(
    result.isRequired({ a: 1 }, 'MyComponent', location),
    true
  )
})

test('chainableCompositTypeChecker.isRequired calls the onRequirmentFailed argument when the value is null', t => {
  const onRequirmentFailed = spy(() => false)

  const location = 'composition'
  const component = 'MyComponent'
  const composition = null

  const result = chainableCompositTypeChecker(() => true, onRequirmentFailed)

  t.deepEqual(
    result.isRequired(composition, component, location),
    false
  )

  t.deepEqual(
    onRequirmentFailed.args[0][0],
    composition
  )
  t.deepEqual(
    onRequirmentFailed.args[0][1],
    component
  )
  t.deepEqual(
    onRequirmentFailed.args[0][2],
    location
  )
})

test('chainableCompositTypeChecker.isRequired calls the onRequirmentFailed argument when the value is undefined', t => {
  const onRequirmentFailed = spy(() => false)

  const location = 'composition'
  const component = 'MyComponent'
  const composition = undefined

  const result = chainableCompositTypeChecker(() => true, onRequirmentFailed)

  t.deepEqual(
    result.isRequired(composition, component, location),
    false
  )

  t.deepEqual(
    onRequirmentFailed.args[0][0],
    composition
  )
  t.deepEqual(
    onRequirmentFailed.args[0][1],
    component
  )
  t.deepEqual(
    onRequirmentFailed.args[0][2],
    location
  )
})
