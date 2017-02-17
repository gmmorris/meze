
import symbolPainter from './symbolPainter'
const { paint, painted, paintedBy } = symbolPainter('serializer')

export const serialize = (serializable, depth = 0) => {
  if (painted(serializable)) {
    return paintedBy(serializable)(depth)
  }
  return null
}

const createOpeningNode = (displayName, props = {}, close = false) => {
  const propsAsArgs = Object.keys(props)
    .map(propName => `${propName}={${props[propName]}}`)
    .join(' ')
  return `<${displayName}${propsAsArgs ? ' ' + propsAsArgs : ''}${close ? ' /' : ''}>`
}

const createClosingNode = (displayName) => {
  return `</${displayName}>`
}

const tabs = num => num > 0 ? new Array(num).fill('  ').join('') : ''
const initialDepth = depth => depth === 0 ? '| ' : ''
function createInstanceSerialiser (serializable, displayName, props) {
  paint(serializable, depth => {
    const { children = [], ...otherProps } = props

    const nudge = tabs(depth)
    const nudgeChild = tabs(depth + 1)
    let pieces = [...children]
      .map(s => serialize(s, depth + 1))
      .filter(s => typeof s === 'string')
      .map(s => `${nudgeChild}${s}`)

    if (pieces.length) {
      return [
        `${initialDepth(depth)}${createOpeningNode(displayName, otherProps)}`,
        ...pieces,
        `${nudge}${createClosingNode(displayName)}`
      ].map(s => `${s}`).join('\n  | ')
    }

    return `${initialDepth(depth)}${createOpeningNode(displayName, otherProps, true)}`
  })
}

export default createInstanceSerialiser
