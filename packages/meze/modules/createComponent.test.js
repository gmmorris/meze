import test from 'ava'

import Meze from './index'
import compose from './compose'
import { componentise } from './createComponent'

// compose
test('componentises functions automatically', async t => {
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
      comparison: <Complex left={left} right={right} />
    }
  }

  t.deepEqual(
    await compose(<Summarize left={40} right={50} />),
    { left: 40, right: 50, comparison: 'smaller' }
  )
})

test('no children array should be created if the component contains no children', async t => {
  const Summarize = function (props) {
    const { left, right, children } = props
    t.is(left, 40)
    t.is(right, 50)
    t.is(children, undefined)
    return { left, right }
  }

  t.deepEqual(
    await compose(<Summarize left={40} right={50} />),
    { left: 40, right: 50 }
  )
})

// createComponent
test('createComponent will convert a regular function to a Component', async t => {
  const Complex = function (props) {
    const { children, ...rest } = props
    return { ...rest, kids: children ? children.length : 0 }
  }

  t.deepEqual(
    await compose(<Complex {...{ left: 40, right: 50 }} />),
    { left: 40, right: 50, kids: 0 }
  )
})

test('createComponent will throw an error for a non Component or non Componentisable arg', t => {
  [{}, false, true, '', 0, { props: {} }].forEach(comp => {
    t.throws(() => {
      <comp />
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
