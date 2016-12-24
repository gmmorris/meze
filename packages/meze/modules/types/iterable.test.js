import test from 'ava'

import iterable from './iterable'

test('iterable validates that a prop on a props object is an object that implements the iterable interface', t => {
  const location = 'composition'
  const props = { a: { [Symbol.iterator]: () => {} } }
  const prop = 'a'
  const component = 'MyComponent'

  t.deepEqual(
    iterable(props, prop, component, location),
    true
  )
})

test('iterable exposes an isRequired method which returns an error if the prop is missing', t => {
  const location = 'prop'
  const props = { a: { [Symbol.iterator]: () => {} } }
  const prop = 'b'
  const component = 'MyComponent'

  const result = iterable.isRequired(props, prop, component, location)
  t.truthy(
    result instanceof Error
  )

  t.deepEqual(
    result.message,
    'Required prop `b` was not specified in `MyComponent`.'
  )
})
