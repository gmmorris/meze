
// internal library
function rerender (ctx, fn) {
  const ref = {}
  ref.fn = (props) => {
    ref.value = fn.call(ref.fn, props)
    ctx.onRender()
  }
  return ref
}

export default function MyComponent (renderFn) {
  this.ref = rerender(this, renderFn)
}

MyComponent.prototype = {
  render: function (props) {
    this.ref.fn(props)
  },
  print: function () {
    console.log(this.ref.value)
  },
  onRender: function (fn) {
    if (fn) {
      this._onRender = fn
    } else if (this._onRender) {
      this._onRender()
    }
  }
}
