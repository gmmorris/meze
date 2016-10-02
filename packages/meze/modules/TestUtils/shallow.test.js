import test from 'ava'

import Meze from '../index'
import shallowCompose from './shallow'

test('shallowCompose accepts and composes an instanciated Component', async t => {
  const DumbComponent = Meze.Component(() => 'yo')

  const res = await shallowCompose(<DumbComponent />)

  t.deepEqual(
    res,
    'yo'
  )
})

test('shallowCompose doesnt accept actual Components', t => {
  const DumbComponent = Meze.Component(() => 'yo')

  t.throws(
    shallowCompose(DumbComponent),
    /Component Definitions can't be shallow/
  )
})

test('shallowCompose doesnt accept uncomposable types', t => {
  t.throws(
    shallowCompose('asd'),
    /Only Meze components may be provided to the shallow composer/
  )
})

// test(`shallowCompose doesn't compose child components`, async t => {
//   const ChildrenAsArrayComponents = Meze.Component(({ children }) => Meze.Children.mapToArray(children))
//   const DumbComponent = Meze.Component(({ msg = 'hi' }) => msg)

//   const res = await shallowCompose(
//     <ChildrenAsArrayComponents>
//       <DumbComponent />
//       <DumbComponent msg="there" />
//     </ChildrenAsArrayComponents>
//   )

//   t.truthy(Array.isArray(res))
//   t.is(typeof res[0], 'function')
//   t.deepEqual(typeof res[0].props, {})
//   t.is(typeof res[1], 'function')
//   t.deepEqual(typeof res[1].props, { msg: 'there' })
// })
