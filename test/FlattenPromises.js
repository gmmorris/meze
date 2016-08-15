import test from 'ava'
import flattenPromises from '../src/FlattenPromises'

test('takes an object and flattens the promises inside it', async t => {
  const result = {
    a: 1,
    b: Promise.resolve(2),
    c: {
      d: Promise.resolve(3),
      e: new Promise(resolve => {
        setTimeout(() => resolve(4), 100)
      })
    }
  }

  t.deepEqual(
    await flattenPromises(result),
    { a: 1, b: 2, c: { d: 3, e: 4 } }
  )
})

test('takes an object and flattens the deep promises inside it', async t => {
  const result = {
    a: 1,
    b: Promise.resolve(2),
    c: {
      d: Promise.resolve(3),
      e: new Promise(resolve => {
        setTimeout(() => resolve(4), 100)
      }),
      f: Promise.resolve({
        h: Promise.resolve(3)
      })
    }
  }

  t.deepEqual(
    await flattenPromises(result),
    { a: 1, b: 2, c: { d: 3, e: 4, f: { h: 3 } } }
  )
})

test('takes a promise and flattens the deep promises inside it', async t => {
  const result = Promise.resolve({
    a: 1,
    b: Promise.resolve(2),
    c: {
      d: Promise.resolve(3),
      e: new Promise(resolve => {
        setTimeout(() => resolve(4), 100)
      }),
      f: Promise.resolve({
        h: Promise.resolve(3)
      })
    }
  })

  t.deepEqual(
    await flattenPromises(result),
    { a: 1, b: 2, c: { d: 3, e: 4, f: { h: 3 } } }
  )
})

