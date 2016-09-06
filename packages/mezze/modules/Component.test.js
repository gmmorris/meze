import test from 'ava'

import { Component, isComponent, createComponent, componentise } from './Component'

// Component tests
test('takes a function and wraps it with an instanciator', t => {
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
  const returnVal = createComponent(Comp, propsToPass, ...childrenToPass)

  t.deepEqual(returnVal, { 'prop': true })
})

test('can be composed with other components', t => {
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
      comparison: createComponent(Complex, {left, right})
    }
  })

  const left = 49
  const right = 50
  const comparison = 'smaller'

  t.deepEqual(
    createComponent(Root, { right, left }),
    { right, left, comparison }
  )
})

// isComponent
test('paints the Component with a Symbol so it can be identified', t => {
  const comp = Component(function () {})
  t.true(isComponent(comp))
})

// createComponent
test('createComponent will convert a regular function to a Component', async t => {
  const Complex = function (props) {
    const { children, ...rest } = props
    return { ...rest, kids: children.length }
  }

  t.deepEqual(
    await createComponent(Complex, { left: 40, right: 50 }),
    { left: 40, right: 50, kids: 0 }
  )
})

test('createComponent will throw an error for a non Component or non Componentisable arg', t => {
  [{}, false, true, '', 0, { props: {} }].forEach(comp => {
    t.throws(() => {
      createComponent(comp, { })
    }, /Invalid Component/)
  })
})

test('createComponent should cache converted constructors', async t => {
  const Complex = function (props) {
    const { children, ...rest } = props
    return { ...rest, kids: children.length }
  }

  t.deepEqual(
    componentise(Complex),
    componentise(Complex)
  )
})
