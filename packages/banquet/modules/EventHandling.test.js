import test from 'ava'
import { spy } from 'sinon'

import Meze from 'meze'
import { On } from './EventHandling'

test('The On component passes the event and handler to the server component', async t => {
  const mockServer = {
    on: spy()
  }

  const event = 'whatever'
  const handler = () => {}

  await Meze.compose(<On server={mockServer} event={event} handler={handler} />)

  t.true(mockServer.on.calledWith(event, handler))
})
