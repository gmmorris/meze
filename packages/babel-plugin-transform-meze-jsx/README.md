# babel-plugin-transform-meze-jsx

Turn JSX into Meze function calls

## Installation

```sh
$ npm install babel-plugin-transform-meze-jsx
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```js
{
  "plugins": ["transform-meze-jsx"]
}
```

### Via CLI

```sh
$ babel --plugins transform-meze-jsx script.js
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  plugins: ["transform-meze-jsx"]
});
```
