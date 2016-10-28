import test from 'ava'

import ComponentInstance from './ComponentInstance'

// ComponentInstance tests
test('Component Instances cant be constructed twice', t => {
  const instance = new ComponentInstance(() => {}, 'SomeName', {})
  instance()
  t.throws(() => {
    instance()
  }, /A SomeName Component Instance cannot be mounted twice/)
})
