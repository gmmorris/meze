import Meze, { children } from 'meze'

const createMethodComponent = method => Meze.Component(({ server, path, handler, name : handlerName }) => {
  if (handlerName) {
    handler.handlerName = handlerName
  }
  return server[method](path, handler)
}) 

export const Get = createMethodComponent('get')
export const Head = createMethodComponent('head')
export const Put = createMethodComponent('put')
export const Post = createMethodComponent('post')
export const Delete = createMethodComponent('del')
