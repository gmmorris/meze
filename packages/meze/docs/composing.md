# Composing

## Basic Composition
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

## Composition Context and testability
In the [Thinking in Components](thinking_in_components.md) documentation we discussed context and how it is passed into the component constructor.

One thing we didn't mention was that, by default *context* has one single property: the *compose* function which can be used by Component authors to compose internal component trees.

What this means is that when authoring a component, you can access the *compose* function from within the *context*.
This is more than just a comfort feature. The core reasoning behind the development of the Meze library is how componentisation helps in reducing efferant coupling. The more **import** statements our code uses, the more this coupling grows.
By using the *compose* function from within the *context* object you reduce your required imports by one.

This also makes it easier for you to test your components. By providing access to the *compose* via the *context* object, we make it easier to *mock* out the composition of child components and write atomic *unit tests* which focus on what the component does seperately from how it composes child components.

Bellow are two examples of unit tests which would be much harder to achieve without using the context based compose function, and even if possible, would have been far less atomic.

```js

const ContextComponent = (props, context) => {
  return context.compose(<InnerComposed val={val} />)
}

test(`ContextComponent is a higher order component wrapping the InnerComposed component`, function(){
  let innerComposeCalled = false

  const contextOverride = {
    compose : (component) => {
      assert(isComponentInstance(component))
      assert(ContextComponent === component.constructor)
      innerComposeCalled = true
    }
  }

  return compose(<ContextComponent val={1} />, contextOverride)

  assert(innerComposeCalled)
})

test(`ContextComponent should pass its 'val' props to the inner InnerComposed`, function(){
  let expectedReturnValue = {}

  const ContextComponent = (props, context) => {
    return context.compose(<InnerComposed val={val} />)
  }

  const contextOverride = {
    compose : (component) => {
      return Promise.resolve(expectedReturnValue)
    }
  }

  return compose(<ContextComponent val={1} />, contextOverride)
    .this(returnValue => {
      assert(returnValue === expectedReturnValue)
    })
})
``` 

We have provided several helper objects under the Meze.TestUtils module in order to make it easier for you to take advantage of this approach and allow you to avoid some of the boilerplate.
