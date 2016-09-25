import test from 'ava'
import flattenPromises from './flattenPromises'

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

test('takes an array and flattens the promises inside it', async t => {
  const result = Promise.resolve([
    1,
    Promise.resolve(2),
    {
      d: Promise.resolve(3),
      e: new Promise(resolve => {
        setTimeout(() => resolve(4), 100)
      }),
      f: Promise.resolve({
        h: Promise.resolve(3)
      })
    }
  ])

  t.deepEqual(
    await flattenPromises(result),
    [1, 2, { d: 3, e: 4, f: { h: 3 } } ]
  )
})

test('flattens promises in deep arrays', async t => {
  const result = await flattenPromises({
    first: [
      new Promise(resolve => {
        setTimeout(() => resolve(1), 100)
      }),
      new Promise(resolve => {
        setTimeout(() => resolve(2), 100)
      })
    ],
    second: [
      new Promise(resolve => {
        setTimeout(() => resolve(3), 100)
      }),
      new Promise(resolve => {
        setTimeout(() => resolve(4), 100)
      })
    ]
  })

  t.deepEqual(
    result,
    { first: [1, 2], second: [3, 4] }
  )
})

test('rejects if any of the promises inside the flattened object have rejected', async t => {
  const result = {
    a: 1,
    b: Promise.reject(new Error('Invalid Result')),
    c: {
      d: Promise.resolve(3),
      e: new Promise(resolve => {
        setTimeout(() => resolve(4), 100)
      })
    }
  }

  t.throws(
    flattenPromises(result),
    /Invalid Result/
  )
})

test('rejects if any of the promises inside the flattened object have rejected asynchronously', async t => {
  const result = {
    a: 1,
    b: Promise.resolve(2),
    c: {
      d: Promise.resolve(3),
      e: new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('Invalid Result')), 100)
      })
    }
  }

  t.throws(
    flattenPromises(result),
    /Invalid Result/
  )
})
