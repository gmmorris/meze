
import symbolPainer from './symbolPainter'

const { paint, painted } = symbolPainer('Component')

export default function Component (constructor) {
  const defaults = { children: [] }
  function instanciate (props) {
    return constructor({...defaults, ...props})
  }
  paint(instanciate)
  return instanciate
}

export const isComponent =
  component => component && painted(component)

export const createComponent =
  (component, props = {}, children = []) => component({ ...props, children })
