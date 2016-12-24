import test from 'ava'

import childrenOfType from './childrenOfType'
import { asChildren } from '../children/Children'
import { string } from 'proptypes'

test('childrenOfType validates that a prop on a props object is a Children collection', t => {
  const location = 'prop'
  const prop = 'children'
  const props = { children: [
    'a string'
  ] }
  const component = 'MyComponent'

  const result = childrenOfType(string)(props, prop, component, location)

  t.truthy(
    result instanceof Error
  )

  t.deepEqual(
    result.message,
    'prop `children` is not a Children type.'
  )
})

test('childrenOfType validates that a prop on a props object is a collection of particular type', t => {
  const location = 'prop'
  const prop = 'children'
  const props = {
    children: asChildren([
      'A single butterfly',
      'fluttering and drifting',
      'in the wind'
    ])
  }
  const component = 'MyComponent'

  t.falsy(
    childrenOfType(string)(props, prop, component, location) instanceof Error
  )
})

test('childrenOfType validates that a prop on a props object is a collection of particular types', t => {
  const location = 'prop'
  const prop = 'children'
  const props = { children: asChildren([
    'A single butterfly',
    'fluttering and drifting',
    123,
    'in the wind'
  ]) }
  const component = 'MyComponent'

  const result = childrenOfType(string)(props, prop, component, location)
  t.truthy(
    result instanceof Error
  )

  t.deepEqual(
    result.message,
    'Invalid prop `children` of type `number` supplied to `MyComponent`, expected `string`.'
  )
})

test('childrenOfType exposes an isRequired method which returns an error if the prop is missing', t => {
  const location = 'prop'
  const prop = 'children'
  const props = { }
  const component = 'MyComponent'

  const result = childrenOfType(string).isRequired(props, prop, component, location)
  t.truthy(
    result instanceof Error
  )

  t.deepEqual(
    result.message,
    'Required prop `children` was not specified in `MyComponent`.'
  )
})
