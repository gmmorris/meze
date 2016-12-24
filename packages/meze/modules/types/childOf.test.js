import test from 'ava'
import Meze from '../index'

import childOf from './childOf'
import { asChildren } from '../children/Children'
import componentValidator from './component'
import { string } from 'proptypes'

test('childOf validates that a prop on a props object is a Children collection', t => {
  const location = 'prop'
  const prop = 'children'
  const props = { children: asChildren([
    'a string'
  ]) }
  const component = 'MyComponent'

  t.falsy(
    childOf(string)(props, prop, component, location) instanceof Error
  )
})

test('childOf validates that a prop on a props object is a single var of a single type', t => {
  const location = 'prop'
  const prop = 'children'
  const props = {
    children: asChildren([])
  }
  const component = 'MyComponent'

  const result = childOf(string)(props, prop, component, location)
  t.truthy(
    result instanceof Error
  )

  t.deepEqual(
    result.message,
    'prop Children contains an incorrect number of children.'
  )
})

test('childOf validates that a prop on a props object is a single var of a specific type', t => {
  const Comp = (props) => ({})

  const location = 'prop'
  const prop = 'children'
  const props = {
    children: asChildren([
      <Comp />
    ])
  }
  const component = 'MyComponent'

  const result = childOf(componentValidator)(props, prop, component, location)
  t.falsy(
    result instanceof Error
  )
})

test('childOf exposes an isRequired method which returns an error if the prop is missing', t => {
  const location = 'prop'
  const prop = 'children'
  const props = { }
  const component = 'MyComponent'

  const result = childOf(string).isRequired(props, prop, component, location)
  t.truthy(
    result instanceof Error
  )

  t.deepEqual(
    result.message,
    'Required prop `children` was not specified in `MyComponent`.'
  )
})
