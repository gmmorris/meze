import test from 'ava'

import syntax from './syntax'

test(`is a func that returns an object with an implementation of manipulateOptions`, t => {
  t.true(typeof syntax === 'function')
  const res = syntax()
  t.true(typeof res.manipulateOptions === 'function')
  t.pass()
})

test(`manipulateOptions is an impure func that changes an arg object and adds JSX to it's plugin list`, t => {
  t.true(typeof syntax === 'function')
  const parserOpts = { plugins: [] }
  const res = syntax()
  res.manipulateOptions({}, parserOpts)
  t.true(parserOpts.plugins[0] === 'jsx')
  t.pass()
})
