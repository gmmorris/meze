import Meze from 'meze'

import Server from './Server'
import { Get, Head, Handler } from './Methods'
import { Send } from './Response'

const GetPersonalisedMessage = ({ name }) => {
  return `hello ${name}, we're speaking via composition`
}

Meze.compose(
  <Server>
    <Get path='/hello/:name'>
      <Send>
        <GetPersonalisedMessage />
      </Send>
    </Get>
    <Head path='/hello/:name'>
      <Send>
        <GetPersonalisedMessage />
      </Send>
    </Head>
  </Server>
).then((server) => {
  server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
  })
})