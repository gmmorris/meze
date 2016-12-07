import test from 'ava'

import iterableOf from './iterableOf'

test('iterableOf validates that a prop on a props object is an object that implements the iterable interface', t => {
  const location = 'composition'
  const props = { a: { [Symbol.iterator]: true } }
  const prop = 'a'
  const component = 'MyComponent'

  t.deepEqual(
    iterableOf(props, prop, component, location),
    true
  )
})

test('iterableOf exposes an isRequired method which returns an error if the prop is missing', t => {
  const location = 'prop'
  const props = { a: { [Symbol.iterator]: true } }
  const prop = 'b'
  const component = 'MyComponent'

  const result = iterableOf.isRequired(props, prop, component, location)
  t.truthy(
    result instanceof Error
  )

  t.deepEqual(
    result.message,
    'Required prop `b` was not specified in `MyComponent`.'
  )
})
