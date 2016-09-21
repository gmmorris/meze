/* @flow */

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

  return Meze.children.reduceComposed(
    Meze.children.cloneWithProps(props.children, { server }),
    // compose children but simply return the server from this Component
    // as we're wrapping the restify API here, it isn't a natural candidate for 
    // composition
    ( result ) => result,
    server
  )    
})

export const Use = Meze.Component(({ server, handler }) => {  
  server.use(handler)    
})

export default Server
