import test from 'ava'

import { Component, createComponent, isComponent } from '../modules/Component'
import compose from '../modules/compose'
import { Assign } from '../modules/children'

// Assign
test('Assign is a Component', t => {
  t.true(
    isComponent(Assign)
  )
})

test('Assign composes an array of components into an index based map', async t => {
  const Child = Component(({ index }) => `Some component at index ${index}`)

  let index = 0

  t.deepEqual(
    await compose(
      createComponent(
        Assign,
        {},
        createComponent(Child, { index: index++ }),
        createComponent(Child, { index: index++ }),
        createComponent(Child, { index: index++ }),
        createComponent(Child, { index: index++ }),
        createComponent(Child, { index: index++ })
      )
    ),
    {
      0: 'Some component at index 0',
      1: 'Some component at index 1',
      2: 'Some component at index 2',
      3: 'Some component at index 3',
      4: 'Some component at index 4'
    }
  )
})

test('Assign composes objects into the result', async t => {
  const Child = Component(({ index }) => `Some component at index ${index}`)

  let index = 0

  t.deepEqual(
    await compose(
      createComponent(
        Assign,
        {},
        createComponent(Child, { index: index++ }),
        createComponent(Child, { index: index++ }),
        {
          [`key${index}`]: createComponent(Child, { index: index++ }),
          [`key${index}`]: createComponent(Child, { index: index++ })
        }
      )
    ),
    {
      0: 'Some component at index 0',
      1: 'Some component at index 1',
      key2: 'Some component at index 2',
      key3: 'Some component at index 3'
    }
  )
})
