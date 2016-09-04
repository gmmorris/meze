'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var t = _ref.types;

  var visitor = require('babel-helper-builder-mezze-jsx').default({
    pre: function pre(state) {
      var tagName = state.tagName;
      var args = state.args;
      if ((0, _babelTypeMezzeJsx.isCompatTag)(tagName)) {
        args.push(t.stringLiteral(tagName));
      } else {
        args.push(state.tagExpr);
      }
    },
    post: function post(state, pass) {
      state.callee = pass.get('jsxIdentifier')();
    }
  });

  visitor.Program = function (path, state) {
    var id = state.opts.pragma || 'Mezze.createComponent';

    state.set('jsxIdentifier', function () {
      return id.split('.').map(function (name) {
        return t.identifier(name);
      }).reduce(function (object, property) {
        return t.memberExpression(object, property);
      });
    });
  };

  return {
    inherits: require('babel-plugin-syntax-mezze-jsx').default,
    visitor: visitor
  };
};

var _babelTypeMezzeJsx = require('babel-type-mezze-jsx');