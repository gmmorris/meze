import test from 'ava'
import { spy } from 'sinon'

import chainableTypeChecker from './chainableTypeChecker'

test('chainableTypeChecker creates a function which calls the validator', t => {
  const validator = spy(() => true)

  const location = 'composition'
  const props = { a: 1 }
  const prop = 'a'
  const component = 'MyComponent'

  const result = chainableTypeChecker(validator)

  t.deepEqual(
    result(props, prop, component, location),
    true
  )

  t.deepEqual(
    validator.args[0][0],
    props
  )
  t.deepEqual(
    validator.args[0][1],
    prop
  )
  t.deepEqual(
    validator.args[0][2],
    component
  )
  t.deepEqual(
    validator.args[0][3],
    location
  )
  t.deepEqual(
    validator.args[0][4],
    prop
  )
})

test('chainableTypeChecker add an isRequired method which set the prop as required on the props', t => {
  const validator = spy(() => true)

  const location = 'composition'
  const result = chainableTypeChecker(validator)

  t.deepEqual(
    result.isRequired({ a: 1 }, 'a', 'MyComponent', location),
    true
  )
})

test('chainableTypeChecker.isRequired calls the onRequirmentFailed argument when the prop is null', t => {
  const onRequirmentFailed = spy(() => false)

  const location = 'composition'
  const props = { a: 1, b: null }
  const prop = 'b'
  const component = 'MyComponent'

  const result = chainableTypeChecker(() => true, onRequirmentFailed)

  t.deepEqual(
    result.isRequired(props, prop, component, location),
    false
  )

  t.deepEqual(
    onRequirmentFailed.args[0][0],
    props
  )
  t.deepEqual(
    onRequirmentFailed.args[0][1],
    prop
  )
  t.deepEqual(
    onRequirmentFailed.args[0][2],
    component
  )
  t.deepEqual(
    onRequirmentFailed.args[0][3],
    location
  )
  t.deepEqual(
    onRequirmentFailed.args[0][4],
    prop
  )
})

test('chainableTypeChecker.isRequired calls the onRequirmentFailed argument when the prop is undefined', t => {
  const onRequirmentFailed = spy(() => false)

  const location = 'composition'
  const props = { a: 1 }
  const prop = 'b'
  const component = 'MyComponent'

  const result = chainableTypeChecker(() => true, onRequirmentFailed)

  t.deepEqual(
    result.isRequired(props, prop, component, location),
    false
  )

  t.deepEqual(
    onRequirmentFailed.args[0][0],
    props
  )
  t.deepEqual(
    onRequirmentFailed.args[0][1],
    prop
  )
  t.deepEqual(
    onRequirmentFailed.args[0][2],
    component
  )
  t.deepEqual(
    onRequirmentFailed.args[0][3],
    location
  )
  t.deepEqual(
    onRequirmentFailed.args[0][4],
    prop
  )
})
