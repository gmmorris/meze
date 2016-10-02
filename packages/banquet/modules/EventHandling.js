/* @flow */

import Meze from 'meze'

export const On = Meze.Component(({ server, event, handler }) => {
  server.on(event, handler)
})
