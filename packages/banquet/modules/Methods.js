/* @flow */

import Meze, { children } from 'meze'

type handlerType = (req : Object, res : Object, next : (target: ?string) => {}) => {}

const createMethodComponent = method => Meze.Component(({ server, path, handler }) => {
  const handlers = Array.isArray(handler) ? handler : [ handler ]  
  server[method](path, ...handlers)
}) 

export const Get = createMethodComponent('get')
export const Head = createMethodComponent('head')
export const Put = createMethodComponent('put')
export const Post = createMethodComponent('post')
export const Delete = createMethodComponent('del')
