import { isCompatTag } from 'babel-type-mezze-jsx'

export default function ({ types: t }) {
  let visitor = require('babel-helper-builder-mezze-jsx').default({
    pre (state) {
      let tagName = state.tagName
      let args = state.args
      if (isCompatTag(tagName)) {
        args.push(t.stringLiteral(tagName))
      } else {
        args.push(state.tagExpr)
      }
    },

    post (state, pass) {
      state.callee = pass.get('jsxIdentifier')()
    }
  })

  visitor.Program = function (path, state) {
    let id = state.opts.pragma || 'Mezze.createComponent'

    state.set(
      'jsxIdentifier',
      () => id.split('.').map((name) => t.identifier(name)).reduce(
        (object, property) => t.memberExpression(object, property)
      )
    )
  }

  return {
    inherits: require('babel-plugin-syntax-mezze-jsx').default,
    visitor
  }
}
