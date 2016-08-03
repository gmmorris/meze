
function mapChildToPromise (child) {
  if (child instanceof Component) {
    child = child.resolve()
  } else if (typeof child === 'function') {
    child = mapChildToPromise(child())
  } else if (!(child instanceof Promise)) {
    child = Promise.resolve(child)
  }
  return child
}

function Component (props = {}, children = []) {
  this.resolve = () => new Promise((resolve, reject) => {
    Promise
      .all(children.map(mapChildToPromise))
      .then(resolve)
  })
}

export default Component
