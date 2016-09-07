const test = require('tape')
const Meze = require('meze').default

test('Simple component composition transpilation and execution', t => {
  const fs = require('fs')
  const babel = require('babel-core')
  const eunoisTransform = require('babel-plugin-transform-meze-jsx').default

  // read the code from this file
  fs.readFile(`${__dirname}/src.js`, function (err, data) {
    if (err) {
      throw err
    }

    // convert from a buffer to a string
    const src = data.toString()

    // use our plugin to transform the source
    const out = babel.transform(src, {
      plugins: [
        eunoisTransform
      ]
    })

    // write transpiled code to temporary file
    const generatedFileName = `/tmp/transpiled${Date.now()}.js`
    fs.writeFile(generatedFileName, out.code, function (err) {
      if (err) {
        throw err
      }

      // require temporary file
      const transpiledFunction = require(generatedFileName)
      // call default export and valdiate result
      transpiledFunction(Meze)
        .then(returnVal => {
          t.deepEqual(returnVal, { 'prop': true })
          t.end()
        })
    })
  })
})
