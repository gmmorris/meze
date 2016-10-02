import test from 'ava'
import { spy } from 'sinon'

import Meze from 'meze'
import { Get, Head, Put, Post, Delete } from './Methods'

const methods = [
  { name: 'get', niceName: 'Get', Method: Get },
  { name: 'head', niceName: 'Head', Method: Head },
  { name: 'put', niceName: 'Put', Method: Put },
  { name: 'post', niceName: 'Post', Method: Post },
  { name: 'del', niceName: 'Delete', Method: Delete }
]
methods.forEach(({name, niceName, Method}) => {
  // Invalid Handler
  test(`${niceName} Method components use an invalid handler when no handler is provided`, async t => {
    t.plan(5)

    let handler
    let methodProp
    const mockServer = {
      [name]: function (methodPropParam, handlerParam) {
        methodProp = methodPropParam
        handler = handlerParam
      }
    }

    await Meze.compose(<Method server={mockServer} />)
    const res = { status: spy(), send: spy() }
    const next = spy()

    t.deepEqual(methodProp, {})
    t.is(typeof handler, 'function')
    handler(undefined, res, next)

    t.true(res.status.calledWith(500))
    t.true(res.send.calledWith('Invalid Handler'))
    t.true(next.calledOnce)
  })

  // Handler creation
  test(`${niceName} Method creates a handler for a child components composition`, async t => {
    t.plan(4)

    let handler
    const mockServer = {
      [name]: function (methodPropParam, handlerParam) {
        handler = handlerParam
      }
    }

    const COMPOSITION_RESULT = 'result'
    const REQ = {}
    const RES = {}
    const next = spy()

    const TestComponent = ({ req: reqArg, res: resArg, next: nextArg }) => {
      t.deepEqual(REQ, reqArg)
      t.deepEqual(RES, resArg)
      t.deepEqual(next, nextArg)
      return COMPOSITION_RESULT
    }

    await Meze.compose((
      <Method server={mockServer}>
        <TestComponent />
      </Method>
    ))

    await handler(REQ, RES, next)
    t.true(next.calledWith(COMPOSITION_RESULT))
  })

  test(`${niceName} Method creates a handler for each child component`, async t => {
    t.plan(3)

    const mockServer = {
      [name]: function (methodPropParam, firstHandler, secondHandler, thirdHandler) {
        t.is(typeof firstHandler, 'function')
        t.is(typeof secondHandler, 'function')
        t.is(typeof thirdHandler, 'function')
      }
    }

    const TestComponent = () => {}

    await Meze.compose((
      <Method server={mockServer}>
        <TestComponent />
        <TestComponent />
        <TestComponent />
      </Method>
    ))
  })

  test(`${niceName} Method names handlers based on the child components handlerName property`, async t => {
    t.plan(3)

    const mockServer = {
      [name]: function (methodPropParam, firstHandler, secondHandler, thirdHandler) {
        t.is(firstHandler.handlerName, 'first')
        t.is(secondHandler.handlerName, 'second')
        t.is(thirdHandler.handlerName, 'third')
      }
    }

    const TestComponent = () => {}

    await Meze.compose((
      <Method server={mockServer}>
        <TestComponent handlerName="first" />
        <TestComponent handlerName="second" />
        <TestComponent handlerName="third" />
      </Method>
    ))
  })

  test(`${niceName} Method passes path and version props to the method function`, async t => {
    t.plan(2)

    const PATH = 'path'
    const VERSION = 1

    const mockServer = {
      [name]: function (methodPropParam) {
        t.is(methodPropParam.path, PATH)
        t.is(methodPropParam.version, VERSION)
      }
    }

    await Meze.compose((
      <Method path={PATH} version={VERSION} server={mockServer} />
    ))
  })
})
