import Meze from 'meze'
import pick from 'lodash.pick'

export const Header = Meze.Component(props => {
  const { res, key, value } = props
  res.header(key, value)
}, 'Header')

export const CharSet = Meze.Component(props => {
  const { res, type } = props
  res.charSet(type)
}, 'CharSet')

export const Cache = Meze.Component(props => {
  const { res, type, options } = props
  res.cache(type, options)
}, 'Cache')

export const Status = Meze.Component(props => {
  const { res, code } = props
  res.status(code)
}, 'Status')

export const ContentType = Meze.Component(props => {
  const { res, type } = props
  res.contentType = type
}, 'ContentType')

function send (method, props) {
  const { req, res, next, spreadParams = true, children } = props
  const childProps = spreadParams
    ? { req, res, next, ...req.params }
    : { req, res, next }
  return Meze.Children
    .onlyComposed(Meze.Children.cloneWithProps(children, childProps))
    .then(body => body ? res[method](body) : body)
}

export const Send = Meze.Component(props => {
  return send('send', props)
}, 'Send')

export const SendJson = Meze.Component(props => {
  return send('json', props)
}, 'SendJson')

export const Redirect = Meze.Component(props => {
  const { res, next, status, url } = props
  if (status && url) {
    res.redirect(
      status,
      url,
      next
    )
  } else {
    res.redirect(
      pick(props, 'hostname', 'pathname', 'port', 'secure', 'permanent', 'query'),
      next
    )
  }
}, 'Redirect')

export default {
  Header,
  CharSet,
  Cache,
  Status,
  ContentType,
  Send,
  SendJson,
  Redirect
}
