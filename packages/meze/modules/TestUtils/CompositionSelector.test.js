import test from 'ava'

import Meze from '../index'
import compositionSelector from './CompositionSelector'

test(`compositionSelector supports Component type selectors`, t => {
  const DumbComponent = ({ val }) => val

  const selector = compositionSelector(DumbComponent)

  t.truthy(selector.isComponent())
  t.falsy(selector.hasProps())
  t.deepEqual(
    selector.props,
    null
  )
})

test(`compositionSelector supports Component instance selectors`, t => {
  const DumbComponent = ({ val }) => val

  const selector = compositionSelector(<DumbComponent a="b" c={1} />)

  t.truthy(selector.isComponent())
  t.truthy(selector.hasProps())
  t.deepEqual(
    selector.props,
    {
      a: 'b',
      c: 1
    }
  )
})

test(`compositionSelector matches Component instances`, t => {
  const DumbComponent = ({ val }) => val

  const selector = compositionSelector(<DumbComponent a="b" c={1} />)

  t.truthy(selector.matches(<DumbComponent a="b" c={1} />))
})

test(`compositionSelector matches Components`, t => {
  const DumbComponent = ({ val }) => val

  const selector = compositionSelector(<DumbComponent a="b" c={1} />)

  t.truthy(selector.matches(DumbComponent))
})
