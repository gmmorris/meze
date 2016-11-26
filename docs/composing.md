# Composing

Composing a tree of components is the very core of what Meze provides as a library and yet its usage is actually very straight forward.

The *Meze.compose* function takes two arguments, a root component and an optional context.
You must provide the *compose* function a Component *instance* rather than a Component *definition*.

That means that the following example **works**:
```js
const SomeComponent = ({ returnValue }) => {
  return returnValue
}

Meze.compose(<SomeComponent returnValue={true} />)
```

But the following example **doesn't work**:
```js
const SomeComponent = ({ returnValue }) => {
  return returnValue
}

Meze.compose(SomeComponent)
```

The return value of the Meze.compose function is a promise, which may *resolve* to the root component's return value or *reject* if an uncaught error is thrown within the composition tree.

The following composition will result in *rejection* and hence will console.log the error.
```js
const SomeResolvingComponent = ({ isValid }) => {
  if(isValid === true) {
    return 'this message will be returned if isValid === true'
  }
  throw Error('Invalid component')
}

Meze
  .compose(<SomeResolvingComponent isValid={false} />)
  .catch(error => console.log(error))
```