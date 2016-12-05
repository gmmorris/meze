# Type Checking your components

An additional way in which Meze borrows from React is by maintaining the extremely good type checking that we have come to expect of our compoennts.
Meze uses React's PropTypes module to provide the same type checking as React, with slight tweaks to make it more suited to the Meze usecase.

We would highly recommend reading the React PropType Type Checking documentation as it works the same way.
The only differences would be that there are several **PropTypes** which are not supported by **Meze** and there are several additional ones as well, specificaly intended for use with Meze.

You can [read the React Docs here](https://facebook.github.io/react/docs/typechecking-with-proptypes.html). 

## Setup
Like React, Meze should ideally only perform typechecking in the development and testing environment, as a potential performance impact may occur, in additional to the library logging warning messages into the console.
Borrowing from Express, in what is now considered by many a ubiquitous configuration, Meze looks for the ***process.env.NODE_ENV*** global object in order to determine if it is running in a *production* environment.

By simply applying the following code in a script which only gets used in your production environment, you can prevent Meze from performing typechecking in your production environment.
```javascript
process.env.NODE_ENV = 'production'
```

## What can you Type Check?
Like react Meze provided type checking for *props* and *context*.

In addition, Meze provides type checking for the ***composition*** of the component.

We have chosen to provide composition type checking in order to aid developers at:
1. Using other developer's components
1. Finding integration problems between components
1. Building **self documenting** components

### PropType checking
Type checking of a component instance's **props** is performed by Meze as it mounts a component.
You can assign a static property on a component named `propTypes` in order to tell Meze what types you expect the **props** to have.

```javascript
const GetVisualProperties = (props) => {
  return {
    color: props.color,
    fontSize: props.fontSize
  }
}

GetVisualProperties.propTypes = {
  color: Meze.PropTypes.string.isRequired,
  fontSize: Meze.PropTypes.number.isRequired
}
```

### ContextType checking
Type checking of a component instance's **context** is performed by Meze as it mounts a component.
You can assign a static property on a component named `contextTypes` in order to tell Meze what types you expect the **context** to have when the component is mounted.

```javascript
const GetVisualProperties = (props, context) => {
  return {
    color: props.color,
    fontSize: props.fontSize ? props.fontSize : context.defaultFontSize 
  }
}

GetVisualProperties.propTypes = {
  color: Meze.PropTypes.string.isRequired,
  fontSize: Meze.PropTypes.number
}

GetVisualProperties.contextTypes = {
  defaultFontSize: Meze.PropTypes.number.isRequired
}
```

In the above example we have chaged the original snipped slightly.

We no longer require the **props.fontSize**, though we still make sure that if it **is** supplied, then it is at least a number.
What we *do* require though is tha a **defaultFontSize** be supplied on the context, and our type checking will notify us if either the defaultFontSize is omited or it is present but of an invalid type (not a number).


### CompositionType checking
Unlike React, where components are pretty much guaranteed to return either ReactNode component instances or a primitive of some kind, we expect Meze components to have a whole variety of potential composition results.

A Meze component may return other Meze compoennt instances, just like React, but in many cases it will return other Javascript objects and primitives.
In addition, unlike React where the "end result" of a React composition is a tree of nested components, a Meze composoition is expected to `**reduce**` into a single value. This means that Meze developers need to put alot of thought into how they treat the composition result of child components and they may have additional concerns relating directly to the composition type of a child components.

In order to facilitate this we allow developers to define the expected Composition Type(s) using a property names `compositionType`.

The following snippets show several usages of **compositionType** to provide type checking of the composed result.

```javascript

const Partial = function (props) {
  return `${props.partialValue}`
}
Partial.compositionTypes = PropTypes.number

await Meze.compose(<Partial partialValue={1}/>)

```
The above composiiton would result in a warning being logged to the console warning that the return type, String, is incorrect.

```bash
`Composition` of `Partial` resulted in invalid type `string`, expected `number`.
```

If you wish, you can use complex types as well, such as the following Shape:

```javascript
const Partial = function () {
  return {
    fontSize: 0
  }
}

Partial.compositionTypes = PropTypes.shape({
  color: PropTypes.string.isRequired,
  fontSize: PropTypes.number
})

await Meze.compose(<Partial />)
```

The above composiiton would result in the following warning:

```bash
Required `composition.color` was not specified in `Partial`.
```

Lastly, there might be situations where your component may result in several different composition types. For instance, your component might compose into either a single resulting String or an array of strings.
Such a composition could be typed thus:

```javascript
const Partial = function (props) {
  return Object.keys(props)
    .reduce((res, propName) => {
      if (Array.isArray(res)) {
        return res.concat([propName])
      } else if (res) {
		    return [res , propName]
      }
      return propName
    }, false)
}


Partial.compositionTypes = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.arrayOf(PropTypes.string)
])

await Meze.compose(<Partial />)
```
