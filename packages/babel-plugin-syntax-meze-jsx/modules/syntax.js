export default function () {
  return {
    manipulateOptions (opts, parserOpts) {
      // for now we're JSX compliant, this might change as we figure out the ideal
      // syntax
      parserOpts.plugins.push('jsx')
    }
  }
}
