import test from 'ava'

import middlewareExtender from './middlewareExtender'

test('should add a then method to the object and return a function for piping a value through the middleware', t => {
  const obj = {}
  const apply = middlewareExtender(obj)
  t.is(typeof obj.then, 'function')
  t.is(typeof apply, 'function')
})

test('apply takes a result and returns the result unchanged when no middleware is available', t => {
  const obj = {}
  const apply = middlewareExtender(obj)
  t.is(typeof obj.then, 'function')
  t.is(apply(1), 1)
})

test('apply takes a result and returns the result after applying its single middleware to it', t => {
  const obj = {}
  const apply = middlewareExtender(obj)
  obj.then(val => val * 2)
  t.is(apply(1), 2)
})

test('apply takes a result and returns the result after applying all middleware to it', t => {
  const obj = {}
  const apply = middlewareExtender(obj)
  obj.then(val => val * 2)
  obj.then(val => val + 3)
  t.is(apply(1), 5)
})
