import Meze from 'meze'

import Server from './Server'
import { Get, Head } from './Methods'

function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

Meze.compose(
  <Server>
    <Get path='/hello/:name' handler={respond} />
    <Head path='/hello/:name' handler={respond} />
  </Server>
).then((server) => {
  server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
  })
})