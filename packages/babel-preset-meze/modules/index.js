import transformMeze from 'babel-plugin-transform-meze'

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
