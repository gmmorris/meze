import transformMeze from 'babel-plugin-transform-meze-jsx'

export default {
  plugins: [
    transformMeze
  ],
  env: {
    development: {
      plugins: [
      ]
    }
  }
}
