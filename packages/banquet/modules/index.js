import Meze from 'meze'
import fetchUrl from 'fetch-promise'

import Server, { Use, Plugins } from './Server'
import { On } from './EventHandling'
import Methods from './Methods'
import Response from './Response'

export default {
  Server,
  Use,
  Plugins,
  On,
  Methods,
  Response
}

const extractNameFromResponse = result => JSON.parse(result.buf.toString())[0]

const GetPersonalisedMessage = ({ name }) => {
  return `hello ${name}, we're speaking via composition`
}

const GetRandomName = ({ children }) => fetchUrl('http://namey.muffinlabs.com/name.json')
  .then(result => {
    const randomName = extractNameFromResponse(result)
    return <GetPersonalisedMessage name={randomName} />
  })

Meze.compose(
  <Server>
    <Methods.Get path="/hello">
      <Response.Send>
        <GetRandomName />
      </Response.Send>
    </Methods.Get>
    <Methods.Head path="/hello">
      <Response.Send>
        <GetRandomName />
      </Response.Send>
    </Methods.Head>
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
