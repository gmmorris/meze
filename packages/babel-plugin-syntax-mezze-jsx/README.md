# babel-plugin-syntax-mezze-jsx

This plugin allows Babel to parse the Mezze JSX syntax.
If you want to transform it then see transform-mezze-jsx.

## Installation

```sh
$ npm install babel-plugin-syntax-mezze-jsx
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["syntax-mezze-jsx"]
}
```

### Via CLI

```sh
$ babel --plugins syntax-mezze-jsx script.js
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  plugins: ["syntax-mezze-jsx"]
});
```
