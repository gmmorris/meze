import test from 'ava'

import Meze from '../index'

import { isComponent } from '../Component'
import compose from '../compose'
import { Assign, assign } from './assign'

// Assign
test('Assign is a Component', t => {
  t.true(
    isComponent(Assign)
  )
})

test('Assign composes an array of components into an index based map', async t => {
  const Child = ({ index }) => `Some component at index ${index}`

  let index = 0

  t.deepEqual(
    await compose(
      <Assign>
        <Child index={index++} />
        <Child index={index++} />
        <Child index={index++} />
        <Child index={index++} />
        <Child index={index++} />
      </Assign>
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
  const Child = ({ index }) => `Some component at index ${index}`

  let index = 0

  t.deepEqual(
    await compose(
      <Assign>
        <Child index={index++} />
        <Child index={index++} />
        {{
          [`key${index}`]: <Child index={index++} />,
          [`key${index}`]: <Child index={index++} />
        }}
      </Assign>
    ),
    {
      0: 'Some component at index 0',
      1: 'Some component at index 1',
      key2: 'Some component at index 2',
      key3: 'Some component at index 3'
    }
  )
})

test('assign is a function', t => {
  t.true(typeof assign === 'function')
})

test('assign merges objects with their key structure and other object by their index', t => {
  const six = 6
  t.deepEqual(
    assign([
      'first',
      'second',
      { third: 33 },
      4,
      { [`fifth${six}`]: undefined }
    ]),
    {
      0: 'first',
      1: 'second',
      third: 33,
      3: 4,
      fifth6: undefined
    }
  )
})
