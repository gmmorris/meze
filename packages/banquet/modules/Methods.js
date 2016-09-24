/* @flow */

import Meze from 'meze'

type handlerType = (req : Object, res : Object, next : (target: ?string) => {}) => {}

function emptyHandler(req, res, next) {
  res.send('Invalid Handler')
  next()
}

const flattenChildren = children => children && children.length === 1 ? children[0] : children

const createMethodComponent = method => Meze.Component(props => {
  const { server, children, ...methodProps } = props
  const handler = children && children.length
    ? function(req, res, next) {
        Meze.compose(flattenChildren(Meze.children.cloneWithProps(children, { req, res })))
          .then(result => {
            if (result !== undefined) {
              res.send(result)
            }
            next()
          })
      }
    : emptyHandler

  server[method](methodProps, handler)
}) 

export const Get = createMethodComponent('get')
export const Head = createMethodComponent('head')
export const Put = createMethodComponent('put')
export const Post = createMethodComponent('post')
export const Delete = createMethodComponent('del')
