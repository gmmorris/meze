import test from 'ava'

import childrenOf from './childrenOf'
import { asChildren } from '../children/Children'
import { string, number } from 'proptypes'

test('childrenOf validates that a prop on a props object is a Children collection', t => {
  const location = 'prop'
  const prop = 'children'
  const props = { children: asChildren([
    'a string',
    123
  ]) }
  const component = 'MyComponent'

  t.falsy(
    childrenOf(string, number)(props, prop, component, location) instanceof Error
  )
})

test('childrenOf validates that a prop on a props object is a collection of particular types', t => {
  const location = 'prop'
  const prop = 'children'
  const props = { children: asChildren([
    'a string'
  ]) }
  const component = 'MyComponent'

  const result = childrenOf(string, number)(props, prop, component, location)
  t.truthy(
    result instanceof Error
  )

  t.deepEqual(
    result.message,
    'prop Children contains an incorrect number of children.'
  )
})

test('childrenOf validates that a prop on a props object is a collection of particular types', t => {
  const location = 'prop'
  const prop = 'children'
  const props = { children: asChildren([
    123
  ]) }
  const component = 'MyComponent'

  const result = childrenOf(string)(props, prop, component, location)
  t.truthy(
    result instanceof Error
  )

  t.deepEqual(
    result.message,
    'Invalid prop `children` of type `number` supplied to `MyComponent`, expected `string`.'
  )
})

test('childrenOf exposes an isRequired method which returns an error if the prop is missing', t => {
  const location = 'prop'
  const prop = 'children'
  const props = { }
  const component = 'MyComponent'

  const result = childrenOf(string, number).isRequired(props, prop, component, location)
  t.truthy(
    result instanceof Error
  )

  t.deepEqual(
    result.message,
    'Required prop `children` was not specified in `MyComponent`.'
  )
})
