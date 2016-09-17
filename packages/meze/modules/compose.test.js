import test from 'ava'

import Meze from './index'

import { Component } from './Component'
import createComponent from './createComponent'
import compose from './compose'
import { Assign } from './utilities/assign'
import range from 'lodash.range'

// compose
test('flattens a tree of components to get passed their internal promises', async t => {
  const Complex = Component(function (props) {
    const { left, right } = props
    const val = left < right
      ? 'smaller'
      : (left > right
        ? 'larger'
        : 'equal')
    return val
  })

  const Summarize = Component(function (props) {
    const { left, right } = props
    return {
      left,
      right,
      comparison: createComponent(Complex, {left, right})
    }
  })

  t.deepEqual(
    await compose(createComponent(Summarize, { left: 40, right: 50 })),
    { left: 40, right: 50, comparison: 'smaller' }
  )
})

test('flattens child components into properties', async t => {
  const PostponedSum = Component(function (props) {
    const { left, right } = props
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(left + right)
      }, 10)
    })
  })

  const Summarize = Component(function (props) {
    const { left, right } = props
    const rangeOfNumbers = range(left, right + 1)
    return {
      sum: createComponent(Assign, {},
        ...rangeOfNumbers.map(index => createComponent(PostponedSum, { left, right: index }))
      ),
      count: rangeOfNumbers.length
    }
  })

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
