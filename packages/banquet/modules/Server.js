/* @flow */
import Meze from 'meze'
import restify from 'restify'
import pick from 'lodash.pick'

type ServerProptypes = {
  certificate?: string,
  key?: string,
  formatters?: Object,
  log?: Object,
  name?: string,
  spdy?: Object,
  version?: string | Array<string>,
  handleUpgrades?: boolean,
  httpsServerOptions?: Object,
  children?: any
}

const Server = Meze.Component((props : ServerProptypes) => {
  const server = restify.createServer(props)

  return Meze.Children.reduceComposed(
    Meze.Children.cloneWithProps(props.children, { server }),
    // compose children but simply return the server from this Component
    // as we're wrapping the restify API here, it isn't a natural candidate for
    // composition
    result => result,
    server
  )
})

export const Use = Meze.Component(({ server, handler }) => {
  server.use(handler)
})

// Components for Restify's Bundled Plugins
const AcceptParser = Meze.Component(({ server, acceptable }) => {
  return <Use server={server} handler={restify.acceptParser(acceptable || server.acceptable)} />
})

function capitalizeFirstLetter (str : string) : string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const pluginsBundledInRestify = {
  throttle: ['burst', 'rate', 'ip', 'overrides'],
  CORS: ['origins', 'credentials', 'headers'],
  queryParser: ['mapParams'],
  bodyParser: [
    'maxBodySize', 'mapParams', 'mapFiles', 'overrideParams',
    'multipartHandler', 'multipartFileHandler', 'keepExtensions', 'uploadDir', 'multiples', 'hash'
  ],
  authorizationParser: null,
  conditionalRequest: null,
  dateParser: null,
  gzipResponse: null,
  jsonp: null,
  requestExpiry: null
}

export const Plugins = Object
  .keys(pluginsBundledInRestify)
  .reduce((plugins : Object, fnName : string) : Object => {
    const propsKeys = Array.isArray(plugins[fnName]) ? plugins[fnName] : false
    plugins[capitalizeFirstLetter(fnName)] =
      Meze.Component((props) => {
        const pluginProps = propsKeys ? pick(props, ...propsKeys) : undefined
        return <Use server={props.server} handler={restify[fnName](pluginProps)} />
      })
    return plugins
  }, {
    AcceptParser
  })


export default Server
