import test from 'ava'

import ComponentInstance from './ComponentInstance'

// ComponentInstance tests
test('Component Instances cant be constructed twice', t => {
  const instance = new ComponentInstance(() => {}, {})
  instance()
  t.throws(() => {
    instance()
  })
})
