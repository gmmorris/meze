import test from 'ava'
import { spy } from 'sinon'
import ComponentInstance from './ComponentInstance'

// ComponentInstance tests
test('Component Instances cant be constructed twice', t => {
  const instance = new ComponentInstance(() => {}, 'SomeName', {})
  instance()
  t.throws(() => {
    instance()
  }, /A SomeName Component Instance cannot be mounted twice/)
})

test('ComponentInstance triggers the componentWillMount from the props just before mounting a component', t => {
  t.plan(3)

  const props = {
    componentWillMount: spy(),
    componentDidMount: spy(),
    componentWillUnmount: spy()
  }

  const constructor = function () {
    t.truthy(props.componentWillMount.calledOnce)
    t.truthy(props.componentDidMount.notCalled)
    t.truthy(props.componentWillUnmount.notCalled)
  }

  const mount = new ComponentInstance(constructor, '', props)
  mount()
})

test('ComponentInstance triggers the componentDidMount from the props just after mounting a component', t => {
  t.plan(2)

  const props = {
    componentDidMount: spy()
  }

  const constructor = function () {
    t.truthy(props.componentDidMount.notCalled)
  }

  const mount = new ComponentInstance(constructor, '', props)
  mount()
  t.truthy(props.componentDidMount.calledOnce)
})

test(`ComponentInstance triggers props.componentWillUnmount after it's result has been fully composed passing the result as argument`, async t => {
  t.plan(3)

  const props = {
    componentWillUnmount: spy()
  }

  const result = { data: true }

  const constructor = function () {
    return new Promise(resolve => {
      t.truthy(props.componentWillUnmount.notCalled)
      resolve(result)
    })
  }

  const mount = new ComponentInstance(constructor, '', props)
  await mount()
// console.log(props.componentWillUnmount.firstCall)
  t.truthy(props.componentWillUnmount.calledOnce)
  t.truthy(props.componentWillUnmount.calledWith(result))
})
