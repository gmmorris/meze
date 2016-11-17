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

test(`shallowCompose.is checks if the root of the wrapper is a specific compenent type`, async t => {
  const ChildrenAsOnlyComponent = ({ children }) => Meze.Children.only(children)
  const DumbComponent = ({ msg = 'hi' }) => msg
  const OtherDumbComponent = ({ msg = 'hi' }) => msg

  const res = await shallowCompose(
    <ChildrenAsOnlyComponent>
      <DumbComponent />
    </ChildrenAsOnlyComponent>
  )

  t.truthy(
    res.is(DumbComponent)
  )

  t.falsy(
    res.is(OtherDumbComponent)
  )
})

test(`shallowCompose.is checks if the root of the wrapper is a specific compenent instance`, async t => {
  const ChildrenAsOnlyComponent = ({ children }) => Meze.Children.only(children)
  const DumbComponent = ({ msg = 'hi' }) => msg

  const res = await shallowCompose(
    <ChildrenAsOnlyComponent>
      <DumbComponent msg="haha" />
    </ChildrenAsOnlyComponent>
  )

  const is = res.is(<DumbComponent msg="haha" />)

  t.truthy(
    is
  )

  const isnt = res.not(<DumbComponent msg="hi" />)
  t.truthy(
    isnt
  )

  t.falsy(
    res.is(<DumbComponent msg="hi" />)
  )
})

test(`shallowCompose.contains checks if the root of the wrapper contains a specific compenent type`, async t => {
  const ChildrenAsOnlyComponent = ({ children }) => ({
    a: {
      b: [
        1,
        2,
        3,
        { asd: Meze.Children.only(children) }
      ]
    }
  })
  const DumbComponent = ({ msg = 'hi' }) => msg
  const OtherDumbComponent = ({ msg = 'hi' }) => msg

  const res = await shallowCompose(
    <ChildrenAsOnlyComponent>
      <DumbComponent />
    </ChildrenAsOnlyComponent>
  )

  t.truthy(
    res.contains(DumbComponent)
  )

  t.falsy(
    res.contains(OtherDumbComponent)
  )
})

test(`shallowCompose.contains checks if the root of the wrapper contains a specific compenent instancnes`, async t => {
  const ChildrenAsOnlyComponent = ({ children }) => ({
    a: {
      b: [
        1,
        2,
        3,
        { asd: Meze.Children.mapToArray(children) }
      ]
    }
  })
  const DumbComponent = ({ msg }) => msg
  const DumbWithDefaultComponent = ({ msg = 'hi' }) => msg

  const res = await shallowCompose(
    <ChildrenAsOnlyComponent>
      <DumbComponent msg="hi" />
      <DumbWithDefaultComponent />
    </ChildrenAsOnlyComponent>
  )

  const contains = res.contains(<DumbComponent msg="hi" />)
  t.truthy(
    contains
  )

  const dosntContain = res.contains(<DumbComponent msg="haha" />)
  t.falsy(
    dosntContain
  )

  t.truthy(
    res.contains(DumbWithDefaultComponent)
  )
  t.truthy(
    res.contains(<DumbWithDefaultComponent />)
  )
  t.falsy(
    res.contains(<DumbWithDefaultComponent msg="hi" />)
  )
})
