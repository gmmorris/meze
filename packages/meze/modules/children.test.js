import test from 'ava'

import Meze from './index'
import { Component } from './Component'
import compose from './compose'
import children, { isChildrenArray } from './children'

// Children tests
test('map applies a function to an array and marks the array as a ChildArray', t => {
  const maped = Children.map([
    1, 2, 3
  ], i => i)
  t.true(isChildrenArray(maped))
})

test('map applies the identity when no mapper function is provided', t => {
  const maped = Children.map([
    1, 2, 3
  ], i => i)
  t.true(isChildrenArray(maped))
})

test('ChildArrays are flattened when passed to a component', async t => {
  const Summarize = Component(function (props) {
    const { children } = props
    return {
      contents: children
    }
  })

  t.deepEqual(
    await compose(
      <Summarize>
        {
          Children.map([
            1, 2, 3
          ])
        }
      </Summarize>
    ),
    { contents: [1, 2, 3] }
  )
})
