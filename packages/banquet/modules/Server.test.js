import test from 'ava'
import { spy, stub } from 'sinon'

import Meze, { TestUtils } from 'meze'
import Server, { Plugins, Use, AcceptParser } from './Server'
import { capitalizeFirstLetter } from './utilities'

test(`Use should pass the handler prop to the use method of the server prop`, async t => {
  let handler = () => {}
  const mockServer = {
    use: spy()
  }

  await Meze.compose(<Use server={mockServer} handler={handler} />)

  t.true(mockServer.use.calledWith(handler))
})

test(`Server should instanciate a server by calling restify's createServer method`, async t => {
  const mockRestify = {
    createServer: spy()
  }

  const propsToPass = {

  }

  await Meze.compose(<Server restify={mockRestify} {...propsToPass} />)

  t.deepEqual(
    mockRestify.createServer.getCall(0).args[0],
    propsToPass
  )
})

test(`Server should pass all its props to createServer other than restify`, async t => {
  const mockRestify = {
    createServer: spy()
  }

  const propsToPass = {
    certificate: 'certificate',
    key: 'key',
    formatters: { format: '' },
    log: { log: '' },
    name: 'name',
    spdy: { spdy: '' },
    version: '1.0',
    handleUpgrades: true,
    httpsServerOptions: { opt: 1 }
  }

  await Meze.compose(<Server restify={mockRestify} {...propsToPass} />)

  t.deepEqual(
    mockRestify.createServer.getCall(0).args[0],
    propsToPass
  )
})

test(`Server shouldn't pass properties to createServer if they aren't valid arguments`, async t => {
  const mockRestify = {
    createServer: spy()
  }

  const propsToPass = {
    certificate: 'certificate',
    key: 'key',
    formatters: { format: '' },
    log: { log: '' },
    handleUpgrades: true
  }

  const propsNotToPass = {
    abrah: 'certificate',
    cadabra: 'key',
    jumbo: 'jet'
  }

  await Meze.compose(<Server restify={mockRestify} {...propsToPass} {...propsNotToPass} />)

  t.deepEqual(
    mockRestify.createServer.getCall(0).args[0],
    propsToPass
  )
})

test(`Server should return the restify server object after composition`, async t => {
  const server = {}
  const mockRestify = {
    createServer: () => server
  }

  const composedServer = await Meze.compose(<Server restify={mockRestify} />)

  t.is(
    composedServer,
    server
  )
})

test(`Server compose all it's child component before resolving with the server`, async t => {
  const server = {}
  const mockRestify = {
    createServer: () => server
  }

  const nameComposed = {
    first: false,
    second: false
  }

  const DumbComponent = ({ name }) => {
    nameComposed[name] = true
  }

  const composedServer = await Meze.compose(
    <Server restify={mockRestify}>
      <DumbComponent name="first" />
      <DumbComponent name="second" />
    </Server>
  )

  t.truthy(nameComposed.first)
  t.truthy(nameComposed.second)

  t.is(
    composedServer,
    server
  )
})

test(`Server passes context to its the child components`, async t => {
  const server = {}
  const mockRestify = {
    createServer: () => server
  }

  const compositionMarker = (function(){
    const nameComposed = {
      first: false,
      second: false
    }
    return {
      mark: name => nameComposed[name] = true,
      isMarked: name => nameComposed[name] === true
    }
  })()

  const DumbComponent = (props, context) => {
    console.log({ props, context })
    context.markComposed(props.name)
  }

  const composedServer = await Meze.compose(
    <Server restify={mockRestify}>
      <DumbComponent name="first" />
      <DumbComponent name="second" />
    </Server>,
    {
      markComposed: compositionMarker.mark
    }
  )

  t.truthy(compositionMarker.isMarked('first'))
  t.truthy(compositionMarker.isMarked('second'))

  t.is(
    composedServer,
    server
  )
})

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

Object.keys(pluginsBundledInRestify)
  .forEach(pluginName => {
    const expectedComponentName = capitalizeFirstLetter(pluginName)

    test(`Plugins should expose a Component for the ${pluginName} plugin named ${expectedComponentName}`, t => {
      t.truthy(Meze.isComponent(Plugins[expectedComponentName]))
    })

    test(`The ${expectedComponentName} component should call the restify.${pluginName} method and tell the server to use it's handler`, async t => {
      const server = {}

      const pluginReturnValue = {}
      const mockRestify = {
        [pluginName]: stub()
      }

      mockRestify[pluginName].onFirstCall().returns(pluginReturnValue)

      const NO_PROPS = {}
      const MethodComponent = Plugins[expectedComponentName]
      const props = pluginsBundledInRestify[pluginName]
        ? pluginsBundledInRestify[pluginName]
          .reduce((pluginProps, propName, index) => {
            pluginProps[propName] = index
            return pluginProps
          }, {})
        : NO_PROPS

      const pluginComposition = await TestUtils.shallowCompose(
        <MethodComponent restify={mockRestify} server={server} {...props} />
      )

      const is = pluginComposition.is(
        <Use server={server} handler={pluginReturnValue} />
      )

      t.truthy(
        is
      )

      t.truthy(mockRestify[pluginName].calledOnce)
      t.deepEqual(mockRestify[pluginName].firstCall.args[0], props !== NO_PROPS ? props : undefined)
    })
  })

