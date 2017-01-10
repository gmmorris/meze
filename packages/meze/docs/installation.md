# Install

There is only one module you *need* in order to start using Meze, which is the core *meze* module. In addition you'd probably benefit from using *babel-preset-meze* as well, which will allow you to start using Meze components via JSX.

```sh
npm install --save meze
npm install --save-dev babel-preset-meze
```

In order to use *babel-preset-meze* you'll also want to define it's usage in your *.babelrc* file (we've included the es2015 preset).
```json
{
  "presets": ["meze", "es2015"]
}
```

Once you have both of these modules installed and configured you can start defining components and composing them together.



