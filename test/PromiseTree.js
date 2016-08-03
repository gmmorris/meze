import test from 'ava'

import PromiseTree from '../src/PromiseTree'

test('bar', async t => {
  const tree = new PromiseTree({}, [
    new PromiseTree({}, [
      1,
      Promise.resolve(2),
      'asd'
    ]),
    2,
    'asdad',
    new PromiseTree({})
  ])

  t.deepEqual(await tree.resolve(), [
    [ 1, 2, 'asd' ],
    2,
    'asdad',
    []
  ])
})
