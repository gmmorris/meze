import test from 'ava'

test('foo', t => {
  t.pass()
})

test('bar', async t => {
  const bar = new Promise(resolve => {
    setTimeout(() => resolve('bar'), 20)
  })

  t.is(await bar, 'bar')
})
