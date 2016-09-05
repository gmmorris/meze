import test from 'ava'

import { Component, createComponent } from '../modules/Component'
import compose from '../modules/compose'

// compose
test('flattenss a tree of components to get passed their internal promises', async t => {
  const Complex = Component(function (props) {
    const { left, right } = props
    const val = left < right
      ? 'smaller'
      : (left > right
        ? 'larger'
        : 'equal')
    return val
  })

  const Root = Component(function (props) {
    const { left, right } = props
    return {
      left,
      right,
      comparison: createComponent(Complex, {left, right})
    }
  })

  t.deepEqual(
    await compose(createComponent(Root, { left: 40, right: 50 })),
    { left: 40, right: 50, comparison: 'smaller' }
  )
})
