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

## Differences between React.PropTypes and Meze.PropTypes

The following are the different PropTypes available to you in order to specify the types you would like to validate against.

Note that some key React PropTypes are not available for Meze, such as **PropTypes.node** and **PropTypes.element**, as they are not relevant to the Meze use case. 

| PropType name | What is this valdiator checking for? |
| ---------- | -------------- |
| `Meze.PropTypes.array` | An optional Array |
| `Meze.PropTypes.bool` | An optional Boolean |
| `Meze.PropTypes.func` | An optional Function |
| `Meze.PropTypes.number` | An optional Number |
| `Meze.PropTypes.object` | An optional Object (any value where `typeof value === 'object'`) |
| `Meze.PropTypes.string` | An optional String (any value where `typeof value === 'string'`) |
| `Meze.PropTypes.symbol` | An optional Symbol (any value where `typeof value === 'symbol'`) |
| `Meze.PropTypes.any` | An optional property which can hold any value. Coupled with the `isRequired` property can be very useful. |
| `Meze.PropTypes.instanceOf(InstanceType)` | An optional object of a particular type (any value where `value instanceof InstanceType` is truthy) |
| `Meze.PropTypes.oneOf([0, 1])` | A value in an Enum of values |
| `Meze.PropTypes.oneOfType([Meze.PropTypes.string, Meze.PropTypes.number])` | A value of one of the types in a list |
| `Meze.PropTypes.arrayOf(Type)` | An array of a certain type |
| `Meze.PropTypes.iterable` | An iterable object |
| `Meze.PropTypes.childOf(Type)` | A Children object with one single child in it of a specific type |
| `Meze.PropTypes.childrenOf(Type, ...)` | A Children object of a specific number of typed children |
| `Meze.PropTypes.childrenOfType(Type)` | A Children object of at lest one child of a specific typed |
| `Meze.PropTypes.objectOf(Type)` | A dictionary (Javascript Object) whose properties are all of a specific type |
| `Meze.PropTypes.shape({ ... })` | A dictionary with a particular shape |
| `Meze.PropTypes.intersection(...)` | An intersection of types, using validators (see example under CompositionType validation) |
| `Meze.PropTypes.union(...)` | A union of types, using validators (see example under CompositionType validation) |
| `Meze.PropTypes.prop((props, propName, componentName) => {})` | Custom validator for propTypes & contextTypes |
| `Meze.PropTypes.composit((composition, componentName) => {})` | Custom validator for compositionTypes |

On every type you may use the `.isRequired` property to signify that the value is required and hence not optional.

```javascript
MyComponent.propTypes = {
  
  optionalArray: Meze.PropTypes.array,

  // An object that could be one of many types
  optionalUnion: Meze.PropTypes.oneOfType([
    Meze.PropTypes.string,
    Meze.PropTypes.number,
    Meze.PropTypes.instanceOf(MyProto)
  ]),

  // A required array of numbers
  requiredArrayOfNums: Meze.PropTypes.arrayOf(Meze.PropTypes.number).isRequired,

  // An optional object with numeric properties
  optionalObjectOfNums: Meze.PropTypes.objectOf(Meze.PropTypes.number),

  // An object taking on a particular shape
  optionalObjectWithShape: Meze.PropTypes.shape({
    name: Meze.PropTypes.string,
    age: Meze.PropTypes.number
  }),

  // you can specify a custom validator to be called whenever a particalu
  // prop appears on a component instance
  customProp: Meze.PropTypes.prop(function(props, propName, componentName) {
    if (props[propName][myPrivateSymbol] !== true) {
      return new Error(
        `Invalid prop ${propName} supplied to ${componentName}. Only ${myPrivateSymbol} should be supplied as customProp.`
      );
    }
  }),

  // children prop receives one child of any type
  children: Meze.PropTypes.childOf(Meze.PropTypes.any),
  
  // children prop receives functions
  children: Meze.PropTypes.childrenOfType(Meze.PropTypes.func),

  // children prop receives children of a function, object and two numbers
  children: Meze.PropTypes.childrenOf(
    Meze.PropTypes.func,
    Meze.PropTypes.obj,
    Meze.PropTypes.number,
    Meze.PropTypes.number
  )
}

MyComponent.compositionTypes = Meze.PropTypes.union(
  Meze.PropTypes.number,
  Meze.PropTypes.composit(function(composition, componentName) {
    if (typeof composition.asNumber() !== 'number') {
      return new Error(
        `Invalid composition of ${componentName}, it should only return a number or an object convertable to a number.`
      );
    }
  })
)
```

### Validating Children

The **PropTypes.element** used in React to denote a React Element is not relevant to Meze, but instead the **PropTypes.component** can be used to validate a Meze component.

Using the **PropTypes.component** you can specify how many children you are willing to have your component compose with.

For example, the following **propTypes** will validate that **children** be a single non optional child component, and not several.

```javascript
const MyComponent = ({ children }) => {
  return (
    <SomeWrapperComponent>
      {children}
    </SomeWrapperComponent>
  )
}

MyComponent.propTypes = {
  children: Meze.PropTypes.component.isRequired
}
```

In the following snippet the component will validate to make sure that it is only composed around an object who'se keys are components.

```javascript
const MyComponent = ({ val }) => val

const AssignChildren = ({ children }) => {
  return Meze.Children.reduce(children, (allChildrenAsObject, currentObject) => {
    return Object.assign(allChildrenAsObject, currentObject)
  }, {})
}

AssignChildren.propTypes = {
  children: Meze.PropTypes.iterableOf(
    Meze.PropTypes.objectOf(Meze.PropTypes.component)
  )
}

Meze
  .compose(
    <AssignChildren>
      {{ asd: <MyComponent val={1} />}}
      {{ dfs: <MyComponent val={2} />}}
    </AssignChildren>
  )
  .then(composition => {
    assertEqual(
      composition,
      {
        asd: 1,
        dfs: 2
      }
    )
  })
```
