# babel-plugin-transform-mezze-jsx

Turn JSX into Mezze function calls

## Installation

```sh
$ npm install babel-plugin-transform-mezze-jsx
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```js
{
  "plugins": ["transform-mezze-jsx"]
}
```

### Via CLI

```sh
$ babel --plugins transform-mezze-jsx script.js
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  plugins: ["transform-mezze-jsx"]
});
```
