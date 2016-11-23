# babel-preset-meze

> Babel preset for all Meze plugins.

As of the time of writing this README there is actually only one Meze plugin which is needed for Babel integration, but in case that changes, we recommend consuming this module in the first place, instead of using the transform plugin directly.

## Install

```sh
$ npm install --save-dev babel-preset-meze
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "presets": ["meze"]
}
```

### Via CLI

```sh
$ babel script.js --presets meze 
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  presets: ["meze"]
});
```