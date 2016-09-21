import test from 'ava'

import Meze from './index'
import { Component } from './Component'
import compose from './compose'
import children, { isChildrenArray, reduceComposed } from './children'

// Children tests
test('map applies a function to an array and marks the array as a ChildArray', t => {
  const maped = children.map([
    1, 2, 3
  ], i => i)
  t.true(isChildrenArray(maped))
})

test('map applies the identity when no mapper function is provided', t => {
  const maped = children.map([
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
          children.map([
            1, 2, 3
          ])
        }
      </Summarize>
    ),
    { contents: [1, 2, 3] }
  )
})

test.only('reduceComposed composes childen of a component and applied a reducer to their results', async t => {

  const PosponedComp = Component(props => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(props.val)
      }, parseInt(Math.random()*100))
    })
  }) 

  const Summarize = Component(function (props) {
    const { children } = props
    return {
      sum: reduceComposed(children, (sum, val) => {
        return sum + val
      }, 0)
    }
  })

  t.deepEqual(
    await compose(
      <Summarize>
        <PosponedComp val={1} />
        <PosponedComp val={2} />
        <PosponedComp val={3} />
      </Summarize>
    ),
    { sum: 6 }
  )
})
