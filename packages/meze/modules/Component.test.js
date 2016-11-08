import test from 'ava'

import Meze from './index'

import { Component, isComponent } from './Component'
import compose from './compose'
import Children from './Children'
import { Assign } from './utilities/assign'

// Component tests
test('takes a function and wraps it with an instanciator', async t => {
  t.plan(3)

  const propsToPass = {
    A: 'prop',
    B: 'otherProp'
  }
  const childrenToPass = [true, { some: 'prop' }]

  const functionToExecute = (props) => {
    const { children, ...rest } = props
    t.deepEqual(rest, propsToPass)
    t.deepEqual(children, childrenToPass)
    return { [props.A]: children[0] }
  }

  const Comp = Component(functionToExecute)

  t.deepEqual(
    await compose(<Comp {...propsToPass}>{Children.spread(childrenToPass)}</Comp>),
    { 'prop': true }
  )
})

test('can be composed with other components', async t => {
  const Complex = Component(function (props) {
    const { left, right } = props
    const val = left < right
      ? 'smaller'
      : (left > right
        ? 'larger'
        : 'equal')
    return val
  })

  const rand = () => parseInt(Math.random() * 100)

  const Root = Component(function (props) {
    const { left = rand(), right = rand() } = props
    return {
      left,
      right,
      comparison: <Complex {...{left, right}} />
    }
  })

  const left = 49
  const right = 50
  const comparison = 'smaller'

  t.deepEqual(
    await compose(<Root {...{left, right}} />),
    { right, left, comparison }
  )
})

// isComponent
test('paints the Component with a Symbol so it can be identified', t => {
  const comp = Component(function () {})
  t.true(isComponent(comp))
})

test('child components should be extensible by their containers', async t => {
  const Partial = function (props) {
    const { children = [], ...res } = props
    return { ...res, ...children }
  }

  const Complex = function (props) {
    const { ...rest } = props
    return (
      <Assign left={40} right={50}>
        <Partial {...{ ...rest, id: 1 }} />
        <Partial {...{ ...rest, id: 2 }} />
        <Partial {...{ ...rest, id: 3 }} />
      </Assign>
    )
  }

  t.deepEqual(
    await compose(<Complex {...{ left: 40, right: 50 }} />),
    {
      0: { left: 40, right: 50, id: 1 },
      1: { left: 40, right: 50, id: 2 },
      2: { left: 40, right: 50, id: 3 }
    }
  )
})

test('anonymous child components should be extensible by their containers', async t => {
  const Partial = function (props) {
    const { children = [], ...res } = props
    return { ...res, ...children }
  }

  const Complex = function (props) {
    const { children, ...rest } = props
    return (
      <Assign {...{ left: 40, right: 50 }}>
      {
        Children.cloneWithProps(children, rest)
      }
      </Assign>
    )
  }

  t.deepEqual(
    await compose(
      <Complex left={40} right={50}>
        <Partial id={1} />
        <Partial id={2} />
        <Partial id={3} />
      </Complex>
    ),
    {
      0: { left: 40, right: 50, id: 1 },
      1: { left: 40, right: 50, id: 2 },
      2: { left: 40, right: 50, id: 3 }
    }
  )
})

test('Component should attach the name of the constructor function on the displayName Property', async t => {
  const partialConstructor = function (props) {
    return { ...props }
  }

  const Partial = Component(partialConstructor)

  t.deepEqual(
    Partial.displayName,
    'partialConstructor'
  )
})

test(`Component can receive a displayName which overrides the default constructor function's displayName Property`, async t => {
  const partialConstructor = function (props) {
    return { ...props }
  }

  const Partial = Component(partialConstructor, 'overrideConstructor')

  t.deepEqual(
    Partial.displayName,
    'overrideConstructor'
  )
})

test('Component should attach an <Anonymous> displayName for anonymous constructor functions', async t => {
  const Partial = Component(function (props) {
    return { ...props }
  })

  t.deepEqual(
    Partial.displayName,
    '<Anonymous>'
  )
})

test('Component should use defaultProps if none have been provided', async t => {
  const PropSpreader = function (props) {
    return { ...props }
  }

  PropSpreader.defaultProps = {
    a: 1,
    b: 2
  }

  const actual = await compose(<PropSpreader />)

  t.deepEqual(
    actual,
    { a: 1, b: 2 }
  )
})

test('Component should use defaultProps to extend the provided props', async t => {
  const PropSpreader = function (props) {
    return { ...props }
  }

  PropSpreader.defaultProps = {
    a: 1,
    b: 2
  }

  const actual = await compose(<PropSpreader a={3} />)

  t.deepEqual(
    actual,
    { a: 3, b: 2 }
  )
})

test('Component usage of defaultProps shouldnt clash with additional props', async t => {
  const PropSpreader = function (props) {
    return { ...props }
  }

  PropSpreader.defaultProps = {
    a: 1,
    b: 2
  }

  const actual = await compose(<PropSpreader a={3} c={4} />)

  t.deepEqual(
    actual,
    { a: 3, b: 2, c: 4 }
  )
})
