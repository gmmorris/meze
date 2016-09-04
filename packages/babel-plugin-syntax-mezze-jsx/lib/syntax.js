'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  return {
    manipulateOptions: function manipulateOptions(opts, parserOpts) {
      // for now we're JSX compliant, this might change as we figure out the ideal
      // syntax
      parserOpts.plugins.push('jsx');
    }
  };
};