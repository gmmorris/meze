# babel-plugin-syntax-meze-jsx

This plugin allows Babel to parse the Meze JSX syntax.
If you want to transform it then see transform-meze-jsx.

## Installation

```sh
$ npm install babel-plugin-syntax-meze-jsx
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["syntax-meze-jsx"]
}
```

### Via CLI

```sh
$ babel --plugins syntax-meze-jsx script.js
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  plugins: ["syntax-meze-jsx"]
});
```
