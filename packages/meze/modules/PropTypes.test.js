import test from 'ava'
import { mock } from 'sinon'
import intersection from 'lodash.intersection'

import Meze from './index'
import compose from './compose'
import PropTypes from './PropTypes'

test('PropTypes exposes only types which are relevant to data', t => {
  const expectedTypes = [
    'array',
    'bool',
    'func',
    'number',
    'object',
    'string',
    'any',
    'arrayOf',
    'instanceOf',
    'objectOf',
    'oneOf',
    'oneOfType',
    'shape'
  ]

  t.deepEqual(
    intersection(
      Object.keys(PropTypes),
      expectedTypes
    ).length,
    expectedTypes.length
  )
})

test('PropTypes validates the types of a Components props', async t => {
  var consoleWarn = mock(console)
  consoleWarn.expects('warn').once()

  const Partial = function (props) {
    return { ...props }
  }

  Partial.propTypes = {
    numProp: PropTypes.number,
    enumProp: PropTypes.oneOf(['News', 'Sports'])
  }

  const props = {
    numProp: '42',
    enumProp: 'News'
  }

  const result = await compose(<Partial {...props} />)

  t.deepEqual(
    result,
    props
  )

  consoleWarn.verify()
  consoleWarn.restore()

  // second check in test as the mocking prevents concurrent test
  var consoleWarnNeverCalled = mock(console)
  consoleWarnNeverCalled.expects('warn').never()

  const currEnv = process.env.NODE_ENV
  process.env.NODE_ENV = 'production'
  await compose(<Partial {...props} />)
  process.env.NODE_ENV = currEnv

  consoleWarnNeverCalled.verify()
  consoleWarnNeverCalled.restore()
})


