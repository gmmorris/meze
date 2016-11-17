import test from 'ava'

import Meze from '../index'
import shallowCompose from './shallow'

test(`CompositionWrapper.find supports searching for inner components`, async t => {
  const ChildrenAsArrayComponents = ({ children }) => Meze.Children.only(children)
  const DumbComponent = ({ msg = 'hi' }) => msg
  const UnusedComponent = () => 0

  const res = await shallowCompose(
    <ChildrenAsArrayComponents>
      <DumbComponent msg="there" />
    </ChildrenAsArrayComponents>
  )

  t.deepEqual(
    res.find(DumbComponent)[0].props(),
    { msg: 'there' }
  )

  t.deepEqual(
    res.find(UnusedComponent).length,
    0
  )
})

test(`shallowCompose.find supports searching for inner components within composed objects`, async t => {
  const ChildrenAsObjectOfComponents = ({ children }) => Object.assign(
    {},
    ...Meze.Children.mapToArray(children, (child, index) => ({ [`child_${index}`]: child }))
  )
  const DumbComponent = ({ msg = 'hi' }) => msg

  const res = await shallowCompose(
    <ChildrenAsObjectOfComponents>
      <DumbComponent msg="hi" />
      <DumbComponent msg="there" />
    </ChildrenAsObjectOfComponents>
  )

  const query = res.find(DumbComponent)
  t.deepEqual(
    query.length,
    2
  )

  t.deepEqual(
    query[0].props('msg'),
    'hi'
  )

  t.deepEqual(
    query[1].props('msg'),
    'there'
  )
})

test(`shallowCompose.find supports searching for inner components within composed arrays`, async t => {
  const ChildrenAsObjectOfComponents = ({ children }) => [
    [Meze.Children.mapToArray(children)],
    [Meze.Children.mapToArray(children)]
  ]
  const DumbComponent = ({ msg = 'hi' }) => msg

  const res = await shallowCompose(
    <ChildrenAsObjectOfComponents>
      <DumbComponent msg="hi" />
      <DumbComponent msg="there" />
    </ChildrenAsObjectOfComponents>
  )

  const query = res.find(DumbComponent)
  t.deepEqual(
    query.length,
    4
  )

  t.deepEqual(
    query[0].props('msg'),
    'hi'
  )

  t.deepEqual(
    query[2].props('msg'),
    'hi'
  )

  t.deepEqual(
    query[1].props('msg'),
    'there'
  )

  t.deepEqual(
    query[3].props('msg'),
    'there'
  )
})
