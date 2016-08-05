
const symComponent = Symbol('Component')

export default function Component (constructor) {
  const defaults = { children: [] }
  function instanciate (props) {
    return constructor({...defaults, ...props})
  }
  instanciate[symComponent] = true
  return instanciate
}

export const isComponent =
  component => component && component[symComponent] === true

export const createComponent =
  (component, props = {}, children = []) => component({ ...props, children })
