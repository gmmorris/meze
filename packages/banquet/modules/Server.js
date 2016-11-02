/* @flow */
import Meze from 'meze'
import restifyLibrary from 'restify'
import pick from 'lodash.pick'
import { capitalizeFirstLetter } from './utilities'

type ServerProptypes = {
  restify?: Object,
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

const Server = Meze.Component(({ restify = restifyLibrary, ...props } : ServerProptypes) => {
  const server = restify.createServer(
    pick(
      props,
      'certificate', 'key', 'formatters', 'log', 'name', 'spdy', 'version', 'handleUpgrades', 'httpsServerOptions'
    )
  )

  return Meze.Children.reduceComposed(
    Meze.Children.cloneWithProps(props.children, { server }),
    // compose children but simply return the server from this Component
    // as we're wrapping the restify API here, it isn't a natural candidate for
    // composition
    result => result,
    server
  )
}, 'Server')

export const Use = Meze.Component(({ server, handler }) => {
  server.use(handler)
}, 'Use')

// Components for Restify's Bundled Plugins
const AcceptParser = Meze.Component(({ server, acceptable, restify = restifyLibrary }) => {
  return <Use server={server} handler={restify.acceptParser(acceptable || server.acceptable)} />
}, 'AcceptParser')

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
    const componentName = capitalizeFirstLetter(fnName)
    plugins[componentName] =
      Meze.Component(({ restify = restifyLibrary, ...props }) => {
        const pluginProps = propsKeys ? pick(props, ...propsKeys) : undefined
        return <Use server={props.server} handler={restify[fnName](pluginProps)} />
      }, componentName)
    return plugins
  }, { AcceptParser })

export default Server
