import test from 'ava'

import Meze from './index'

import { Component } from './Component'
import compose from './compose'
import { Assign } from './utilities/assign'
import range from 'lodash.range'

// compose
test('flattens a tree of components to get passed their internal promises', async t => {
  const Complex = function (props) {
    const { left, right } = props
    const val = left < right
      ? 'smaller'
      : (left > right
        ? 'larger'
        : 'equal')
    return val
  }

  const Summarize = function (props) {
    const { left, right } = props
    return {
      left,
      right,
      comparison: <Complex {...{left, right}} />
    }
  }

  t.deepEqual(
    await compose(<Summarize left={40} right={50} />),
    { left: 40, right: 50, comparison: 'smaller' }
  )
})

test('a composition should reject if an internal promises rejects unhandled', async t => {
  const RejectIn = function (props) {
    return new Promise((resolve, reject) => setTimeout(() => reject(new Error('Holy Molly')), props.time))
  }

  const Summarize = function (props) {
    const { left, right } = props
    return {
      left,
      right,
      comparison: <RejectIn time={10} />
    }
  }

  t.throws(
    compose(<Summarize left={40} right={50} />),
    /Holy Molly/
  )
})

test('flattens child components into properties', async t => {
  const PostponedSum = function (props) {
    const { left, right } = props
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(left + right)
      }, 10)
    })
  }

  const Summarize = function (props) {
    const { left, right } = props
    const rangeOfNumbers = range(left, right + 1)
    return {
      sum: (
        <Assign>
          {Meze.Children.map(rangeOfNumbers, index => <PostponedSum left={left} right={index} />)}
        </Assign>
      ),
      count: rangeOfNumbers.length
    }
  }

  t.deepEqual(
    await compose(<Summarize left={40} right={42} />),
    {
      sum: {
        0: 80,
        1: 81,
        2: 82
      },
      count: 3
    }
  )
})
