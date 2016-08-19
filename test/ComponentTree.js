import test from 'ava'

import Component from '../src/Component'
import { createComponent, composeTree } from '../src/ComponentTree'

test('flattes a tree of components to get passed their internal promises', async t => {
  const Complex = Component(function (props, children) {
    const { left, right } = props
    const val = left < right
      ? 'smaller'
      : (left > right
        ? 'larger'
        : 'equal')
    return val
  })

  const Root = Component(function (props, children) {
    const { left, right } = props
    return {
      left,
      right,
      comparison: createComponent(Complex, {left, right})
    }
  })

  t.deepEqual(
    await composeTree(createComponent(Root, { left: 40, right: 50 })),
    { left: 40, right: 50, comparison: 'smaller' }
  )
})
