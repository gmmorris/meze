import Meze from 'meze'

import Server from './Server'
import { Get, Head } from './Methods'

function respond(req, res, next) {
  res.send('HI ' + req.params.name)
  next()
}

const Response = ({ req, res, next }) => {
  return 'hello ' + req.params.name + '!!!!'
}

//<Head path='/hello/:name' handler={respond} />
Meze.compose(
  <Server>
    <Get path='/hello/:name'>
      <Response />
    </Get>
    <Head path='/hello/:name'>
      <Response />
    </Head>    
  </Server>
).then((server) => {
  server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
  })
})