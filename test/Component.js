import test from 'ava'

import Component, { isComponent, createComponent } from '../src/Component'

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
    t.is(children, childrenToPass)
    return { [props.A]: children[0] }
  }

  const Comp = Component(functionToExecute)
  const returnVal = createComponent(Comp, propsToPass, childrenToPass)

  t.deepEqual(returnVal, { 'prop': true })
})

test('paints the Component with a Symbol so it can be identified', t => {
  const comp = Component(function () {})
  t.true(isComponent(comp))
})
