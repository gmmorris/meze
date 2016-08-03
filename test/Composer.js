import test from 'ava'

import Composer from '../src/Composer'
import { onCountdown } from '../src/utils'

test.cb('Compose rerender self after promise in props resolves', t => {
  t.plan(3)

  function render ({ val, onCountdown = null, onDone = () => { t.fail() } }) {
    const res = {
      val,
      onDone
    }

    onCountdown ? onCountdown.then(val => this({ val, onDone })) : onDone(res)

    return res
  }

  function rerenderOnlyOnce () {
    let count = 0
    return function () {
      count++
      t.true(count <= 2, 'render twice')
      if (count === 2) {
        t.end()
      }
    }
  }

  const valueAfterResolution = { someKey: true }

  function onDone (res) {
    t.is(res.val, valueAfterResolution)
  }

  const comp = new Composer(render)
  comp.onRender(rerenderOnlyOnce())
  comp.render({
    val: 0,
    onCountdown: onCountdown(100, valueAfterResolution),
    onDone
  })
})
