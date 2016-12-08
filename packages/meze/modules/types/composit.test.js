import test from 'ava'

import composit from './composit'

test('composit validates that a composition is an object that passes a custom validator function', t => {
  const composition = { a: {} }
  const component = 'MyComponent'

  const validator = (compositionArg, componentArg) => {
    t.deepEqual(composition, compositionArg)
    t.deepEqual(component, componentArg)
    return true
  }

  t.deepEqual(
    composit(validator)(composition, component),
    true
  )
})

test('composit validates that a composition is an object that passes a custom validator function', t => {
  const composition = undefined
  const component = 'MyComponent'

  const validator = (compositionArg, componentArg) => {
    t.deepEqual(composition, compositionArg)
    t.deepEqual(component, componentArg)
    return true
  }

  const result = composit(validator).isRequired(composition, component, 'composition')

  t.truthy(
    result instanceof Error
  )

  t.deepEqual(
    result.message,
    'Required `composition` of `MyComponent` failed to resulted in the custom type'
  )
})
