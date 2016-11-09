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

test('composition flattens deep promises', async t => {
  const Deep = ({ val }) => {
    return { deep: true, val }
  }

  const Shallow = ({ val }) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(<Deep val={val} />)
      }, 10)
    })
  }

  const actual = await compose(<Shallow val={1} />)

  t.deepEqual(
    actual,
    {
      deep: true,
      val: 1
    }
  )
})

test('compose should pass the composition method down through the context of all components it composes', async t => {
  t.plan(2)

  const InnerComposed = ({ val }) => ({
    composed: true,
    val
  })

  const ContextComponent = ({ val }, context) => {
    t.deepEqual(
      context.compose,
      compose
    )
    return context.compose(<InnerComposed val={val} />)
  }

  const actual = await compose(<ContextComponent val={1} />)

  t.deepEqual(
    actual,
    {
      composed: true,
      val: 1
    }
  )
})

test('compose should pass a new context down to all child compositions', async t => {
  t.plan(4)

  const newContext = { someVal: true }

  const InnerComposed = ({ val }, context) => {
    t.deepEqual(
      context.compose,
      compose
    )
    t.deepEqual(
      newContext.someVal,
      context.someVal
    )
    return {
      composed: true,
      val
    }
  }

  const ContextComponent = ({ val }, context) => {
    t.deepEqual(
      context.compose,
      compose
    )
    return context.compose(<InnerComposed val={val} />, newContext)
  }

  const actual = await compose(<ContextComponent val={1} />)

  t.deepEqual(
    actual,
    {
      composed: true,
      val: 1
    }
  )
})

test('compose should pass the existing context down to all child compositions by default', async t => {
  t.plan(6)

  const specificContext = { someVal: true }

  let actualContextInRootComponent

  const InnerComposed = ({ val }, context) => {
    t.deepEqual(
      context.compose,
      compose
    )
    t.deepEqual(
      specificContext.someVal,
      context.someVal
    )
    t.deepEqual(
      actualContextInRootComponent,
      context
    )
    return {
      composed: true,
      val
    }
  }

  const ContextComponent = ({ val }, context) => {
    actualContextInRootComponent = context
    t.deepEqual(
      context.compose,
      compose
    )

    t.deepEqual(
      specificContext.someVal,
      context.someVal
    )
    return <InnerComposed val={val} />
  }

  const actual = await compose(<ContextComponent val={1} />, specificContext)

  t.deepEqual(
    actual,
    {
      composed: true,
      val: 1
    }
  )
})
