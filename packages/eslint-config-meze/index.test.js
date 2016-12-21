import test from 'ava'
import eslint from 'eslint'

import eslintrc from './index'

const isObject =  (obj) => typeof obj === 'object' && obj !== null

test('Module export an eslintrc configuration which extends eslint-plugin-react', t => {
  t.truthy(Array.isArray(eslintrc.plugins))
  t.truthy(eslintrc.plugins.find(i => i === "react"))
  t.deepEqual(
    eslintrc.settings.react.pragma,
    'Meze'
  )
})

test('eslint can load the eslintrc.json as a valid configuration', t => {
  const cli = new eslint.CLIEngine({
    useEslintrc: false,
    configFile: 'eslintrc.json'
  })

  var code = `const Meze = require('meze')
    const MyComponent = () => 'Hello World'
    export default Meze.compose(<MyComponent />)
  `

  t.deepEqual(
    cli.executeOnText(code).errorCount,
    0
  )
})
