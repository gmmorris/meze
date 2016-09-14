import symbolPainter from './internals/symbolPainter'
import extendWithMiddleware from './internals/middlewareExtender'
import compose from './compose'
import createComponent from './createComponent'

const { paint, painted } = symbolPainter('ComponentInstance')
const { paint: paintWithMiddleware, painted: paintedWithMiddleware } = symbolPainter('ComponentInstanceMiddleware')

export const isComponentInstance =
  instance => instance && painted(instance)

export default function ComponentInstance (constructor, props) {
  // console.log(`$$ComponentInstance`)
  // console.log(arguments)
  let once = false
  const construct = () => {
    if (once) {
      throw Error('second')
    }
    once = true
    return Promise.resolve(compose(constructor(props)))
      .then(res => paintedWithMiddleware(this)
      ? this.applyMiddleware(res)
      : res)
  }

  construct.enableMiddleware = () => {
    if (!paintedWithMiddleware(this)) {
      paintWithMiddleware(this)
      this.applyMiddleware = extendWithMiddleware(construct)
    }
    return construct
  }

  construct.clone = function (cloneProps = {}, ...cloneChildren) {
    const { children, ...originalProps } = props
    return createComponent(
      constructor,
      { ...originalProps, ...cloneProps },
      ...(cloneChildren.length ? cloneChildren : children)
    )
  }

  construct.props = Object.freeze(props)

  return paint(construct)
}
