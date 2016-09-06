import symbolPainter from './internals/symbolPainter'
// import flattenPromises from './internals/flattenPromises'
import createComponent from './createComponent'
// import compose from './compose'

const { paint, painted } = symbolPainter('ComponentInstance')

export const isComponentInstance =
  instance => instance && painted(instance)

export default function ComponentInstance (constructor, props) {
  function construct () {
    return constructor(props)
  }
  function clone (cloneProps = {}, ...cloneChildren) {
    const { children, ...originalProps } = props
    return createComponent(
      constructor,
      { ...originalProps, ...cloneProps },
      ...(cloneChildren.length ? cloneChildren : children)
    )
  }
  construct.props = Object.freeze(props)
  return paint({
    construct,
    clone
  })
}
