import test from 'ava'

import Meze from '../index'
import shallowCompose from './shallow'
import { isComponentInstance } from '../ComponentInstance'

test('shallowCompose accepts and composes an instanciated Component', async t => {
  const DumbComponent = props => props.result

  let res = await shallowCompose(<DumbComponent result={'yo'} />)
  t.deepEqual(
    res.composition,
    'yo'
  )

  res = await shallowCompose(<DumbComponent result />)
  t.deepEqual(
    res.composition,
    true
  )

  res = await shallowCompose(<DumbComponent result={{ a: 1, b: 2 }} />)
  t.deepEqual(
    res.composition,
    { a: 1, b: 2 }
  )

  res = await shallowCompose(<DumbComponent result={[1, 2, 3]} />)
  t.deepEqual(
    res.composition,
    [1, 2, 3]
  )

  res = await shallowCompose(<DumbComponent result={123} />)
  t.deepEqual(
    res.composition,
    123
  )
})

test('shallowCompose doesnt accept actual Components', t => {
  const DumbComponent = () => 'yo'

  t.throws(
    shallowCompose(DumbComponent),
    /Component Definitions can't be shallow composed directly. Try using the <ComponentDefinition \/> syntax/
  )
})

test('shallowCompose doesnt accept uncomposable types', t => {
  t.throws(
    shallowCompose('asd'),
    /Only Meze components may be provided to the shallow composer/
  )
})

test(`shallowCompose doesn't compose child components`, async t => {
  const ChildrenAsArrayComponents = ({ children }) => Meze.Children.mapToArray(children)
  const DumbComponent = ({ msg = 'hi' }) => msg

  const result = await shallowCompose(
    <ChildrenAsArrayComponents>
      <DumbComponent />
      <DumbComponent msg="there" />
    </ChildrenAsArrayComponents>
  )

  const { composition } = result
  t.truthy(Array.isArray(composition))
  t.truthy(isComponentInstance(composition[0]))
  t.deepEqual(composition[0].props, {})
  t.truthy(isComponentInstance(composition[1]))
  t.deepEqual(composition[1].props, { msg: 'there' })
})

test(`shallowCompose.find supports searching for inner components`, async t => {
  const ChildrenAsArrayComponents = ({ children }) => Meze.Children.only(children)
  const DumbComponent = ({ msg = 'hi' }) => msg
  const UnusedComponent = () => 0

  const res = await shallowCompose(
    <ChildrenAsArrayComponents>
      <DumbComponent msg="there" />
    </ChildrenAsArrayComponents>
  )

  t.deepEqual(
    res.find(DumbComponent).props(),
    { msg: 'there' }
  )

  t.truthy(
    res.find(UnusedComponent).isEmpty()
  )
})
