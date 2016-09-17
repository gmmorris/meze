import test from 'ava'

import Meze from './index'
import compose from './compose'

// compose
test('componentises functions automatically', async t => {
  const Complex = function (props) {
    const { left, right } = props
    const val = left < right
      ? 'smaller'
      : (left > right
        ? 'larger'
        : 'equal')
    return val
  }

  const Summarize = function (props) {
    const { left, right } = props
    return {
      left,
      right,
      comparison: <Complex {...{left, right}} />
    }
  }

  t.deepEqual(
    await compose(<Summarize {...{ left: 40, right: 50 }} />),
    { left: 40, right: 50, comparison: 'smaller' }
  )
})
