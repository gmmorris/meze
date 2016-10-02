import Meze from 'meze'

import Server, { Use, Plugins } from './Server'
import { On } from './EventHandling'
import Methods from './Methods'
import Response from './Response'

const GetPersonalisedMessage = ({ name }) => {
  return `hello ${name}, we're speaking via composition`
}

export default {
  Server,
  Use,
  Plugins,
  On,
  Methods,
  Response
}

Meze.compose(
  <Server>
    <Methods.Get path="/hello/:name">
      <Response.Send>
        <GetPersonalisedMessage />
      </Response.Send>
    </Methods.Get>
    <Methods.Head path="/hello/:name">
      <Response.Send>
        <GetPersonalisedMessage />
      </Response.Send>
    </Methods.Head>
  </Server>
).then((server) => {
  server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url)
  })
})
