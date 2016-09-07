import restify from 'restify'
import Meze from 'meze'

type ServerProptypes = {
  certificate?: string,
  key?: string,
  formatters?: Object,
  log?: Object,
  name?: string,
  spdy?: Object,
  version?: string | Array<string>,
  handleUpgrades?: boolean,
  httpsServerOptions?: Object
}

const Server = Meze.Component((props : ServerProptypes) => {
  const server = restify.createServer(props)
  // TODO OMG
  return server
})

export default Server
