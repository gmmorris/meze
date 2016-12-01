import test from 'ava'
import { spy, mock } from 'sinon'

import Meze from './index'

import ComponentInstance from './ComponentInstance'
import PropTypes from './types/PropTypes'
import warning from './internals/warning'

// ComponentInstance tests
test('Component Instances cant be constructed twice', t => {
  const mount = new ComponentInstance(() => {}, 'SomeName', {})
  mount()
  t.throws(() => {
    mount()
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
  t.plan(3)

  const props = {
    componentDidMount: spy()
  }

  const result = { a: 1 }

  const constructor = function () {
    t.truthy(props.componentDidMount.notCalled)
    return result
  }

  const mount = new ComponentInstance(constructor, '', props)
  mount()
  t.truthy(props.componentDidMount.calledOnce)
  t.truthy(props.componentDidMount.calledWith(result))
})

test(`ComponentInstance triggers props.componentWillUnmount after it's result has been fully composed passing the result as argument`, async t => {
  t.plan(4)

  const props = {
    componentWillUnmount: spy()
  }

  const result = { data: true }

  const constructor = function () {
    t.truthy(props.componentWillUnmount.notCalled)
    return result
  }

  const mount = new ComponentInstance(constructor, '', props)
  const { onComposed, composition } = mount()
  t.truthy(props.componentWillUnmount.notCalled)
  await onComposed(Promise.resolve(composition))
    .then(x => {
      t.truthy(props.componentWillUnmount.calledOnce)
      t.truthy(props.componentWillUnmount.calledWith(result))
    })
})

test(`ComponentInstance triggers props.componentFailedMount after it's result has rejected`, async t => {
  t.plan(3)

  const props = {
    componentFailedMount: spy()
  }

  const thrownError = Error('Holly Moly')

  const constructor = function () {
    throw thrownError
  }

  const mount = new ComponentInstance(constructor, '', props)
  t.throws(mount().composition)
  t.truthy(props.componentFailedMount.calledOnce)
  t.truthy(props.componentFailedMount.calledWith(thrownError))
})

test(`ComponentInstance validates props of a component on mounting`, async t => {
  const spiedValidate = spy()

  const Partial = function () {}
  Partial.propTypes = {
    numProp: PropTypes.number,
    enumProp: PropTypes.oneOf(['News', 'Sports'])
  }

  const props = {
    numProp: 42,
    enumProp: 'News'
  }

  const mount = new ComponentInstance(Partial, 'PartialName', props, spiedValidate)

  mount()

  const propValidationCall =
    spiedValidate.args
      .filter(args => args[3] === 'prop')

  t.deepEqual(propValidationCall.length, 1)
  t.deepEqual(propValidationCall[0][0], props)
  t.deepEqual(propValidationCall[0][1], Partial.propTypes)
  t.deepEqual(propValidationCall[0][2], 'PartialName')
  t.deepEqual(propValidationCall[0][3], 'prop')
})

test(`ComponentInstance validates context of a component on mounting`, async t => {
  const spiedValidate = spy()

  const Partial = function () {}
  Partial.contextTypes = {
    numProp: PropTypes.number,
    enumProp: PropTypes.oneOf(['News', 'Sports'])
  }

  const context = {
    numProp: 42,
    enumProp: 'News'
  }

  const mount = new ComponentInstance(Partial, 'PartialName', {}, spiedValidate)

  mount(context)

  const contextValidationCall =
    spiedValidate.args
      .filter(args => args[3] === 'context')

  t.deepEqual(contextValidationCall.length, 1)
  t.deepEqual(contextValidationCall[0][0], context)
  t.deepEqual(contextValidationCall[0][1], Partial.contextTypes)
  t.deepEqual(contextValidationCall[0][2], 'PartialName')
  t.deepEqual(contextValidationCall[0][3], 'context')
})

test(`ComponentInstance validates composition of a component after mounting`, async t => {
  const spiedValidate = spy()

  const Partial = function () {
    return 1
  }
  Partial.compositionTypes = PropTypes.number

  const mount = new ComponentInstance(Partial, 'PartialName', {}, spiedValidate)

  const { onComposed, composition } = mount()

  await onComposed(Promise.resolve(composition))
    .then(composition => {
      const contextValidationCall =
        spiedValidate.args
          .filter(args => args[3] === 'prop')

      t.deepEqual(contextValidationCall.length, 1)
      t.deepEqual(contextValidationCall[0][0], { composition })
      t.deepEqual(contextValidationCall[0][1], { composition: PropTypes.number })
      t.deepEqual(contextValidationCall[0][2], 'PartialName')
      t.deepEqual(contextValidationCall[0][3], 'prop')
    })
})


test('ComponentInstance composition validations support a single primitive result', async t => {
  var consoleWarn = mock(console)
  consoleWarn.expects('warn').once()

  const Partial = function (props) {
    return ''
  }

  Partial.compositionTypes = PropTypes.number

  await Meze.compose(<Partial />)

  consoleWarn.verify()
  consoleWarn.restore()
})

