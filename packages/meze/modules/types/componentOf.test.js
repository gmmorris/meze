import test from 'ava'
import Meze from '../index'

import componentOf from './componentOf'

test('componentOf validates that an object is an instance of a specific component type', t => {
  const Comp = (props) => ({})

  const location = 'prop'
  const prop = 'child'
  const props = {
    child: <Comp />
  }
  const component = 'MyComponent'

  const result = componentOf(Comp)(props, prop, component, location)
  t.falsy(
    result instanceof Error
  )
})

test('componentOf returns an error if the type is an instance of another component type', t => {
  const Comp = (props) => ({})
  const OtherComp = (props) => ({})

  const location = 'prop'
  const prop = 'child'
  const props = {
    child: <OtherComp />
  }
  const component = 'MyComponent'

  const result = componentOf(Comp)(props, prop, component, location)
  t.truthy(
    result instanceof Error
  )

  t.deepEqual(
    result.message,
    'prop `child` is not of the correct Component type.'
  )
})

test('componentOf returns an error if the object is not a componant instance', t => {
  const Comp = (props) => ({})
  const OtherComp = (props) => ({})

  const location = 'prop'
  const prop = 'child'
  const props = {
    child: OtherComp
  }
  const component = 'MyComponent'

  const result = componentOf(Comp)(props, prop, component, location)
  t.truthy(
    result instanceof Error
  )

  t.deepEqual(
    result.message,
    'prop `child` is not a Component Instance.'
  )
})
