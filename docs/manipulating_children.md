# Children
## Contents of Children
Whenever a component constructor executed, Meze will check whether the current instance has been composed with any child components and if so add a *children* prop to the *props* argument.
Just like React, children is the only property added to the *props* by Meze itself and if no child components or values are composed with the component, it will be omitted entirely.

The value of the children prop is a Meze specific data structure designed to make it easier to interact with the list of children.

A common mistake made by developers is to assume that the *children* property will contain only Component Instances but it will in fact contain any child values that the component is composed with.
```js
const Echo = ({ children }) => {
  /*
  The `children` prop will contain three
  values:
    [0] The string `You know nothing`
    [1] A Component Instance of the EchoName with the props { name: "John"}
    [2] A Component Instance of the EchoName with the props { name: "Snow"}
  */
}

compose(
  <Echo>
    You know nothing
    <EchoName name="John" />
    <EchoName name="Snow" />
  </Echo>
).then(console.log)
```

## Manipulating Children
All of the following manipulation functions are completely stand alone and receive either your *children* prop (or alternatively any array) as a first argument, so you can access them via the *Meze.Children* object, or use a direct reference to them.

Both of the following components will behave exactly the same.
```js
import Meze from 'meze
const { mapToArray } = Meze.Children

const Summarize = function (props) {
  return {
    contents: Meze.Children.mapToArray(props.children)
  }
}

const SummarizeV2 = function (props) {
  return {
    contents: mapToArray(props.children)
  }
}
```

## Children API reference

Each of the following functions resides on the **Meze.Children** object and they can be split into two groups: Pre and Post composition.
Pre composition are operations which are applied to Component Instanced *before* they are mounted, and Post composition are operations which are applied to the return values of the child components.

### Pre Composition

#### map(children : Children | [], mapper : (item, index) => any) => Children
The map() function creates a new Children data structure with the results of calling a provided function on every element in this children data structure.
Note that if a child is a component then it will still, at this point, be an unmounted Component Instance.

If no mapper function is provided then *map* uses the *identity* function, which would essentially mean a no-op, but hey, maybe some developers roll that way, no criticism here.

A common use for *map* is to create Component Instanced on the fly and pass them onwards to other Children manipulation functions.
```js
const { map } = Meze.Children

const Echo = (props) => JSON.stringify(props)
function nameToComponent (name, index) {
  return <Echo name={name} order={index} />
}

const Summarize = function ({ children }) { 
  return children.toArray()
}

Meze.compose(
    <Summarize>
    {
       map([ "John", "Snow" ], nameToComponent)
    }
    </Summarize>
).then(console.log)
```

The above composition will log the following object to console:
```json
{ 
  contents: [
    '{"firstname":"John","order":0}',
    '{"lastname":"Snow","order":1}'
   ]
}
```

#### mapToArray(children : Children | [], mapper : (item, index) => any) => []
The mapToArray() function operates precisely like map() except that the return value will be an Array.

```js
const { map } = Meze.Children

const Echo = (props) => JSON.stringify(props)

const Summarize = function ({ children }) {
  return {
    contents: mapToArray(
       children,
       (child, index) => child.clone({ order: index })
     )
  }
}

compose(
  <Summarize>
    <Echo firstname="John" />
    <Echo lastname="Snow" />
  </Summarize>  
).then(console.log)
```

The above composition will log the following object to console:
```json
{ 
  contents: [
    '{"firstname":"John","order":0}',
    '{"lastname":"Snow","order":1}'
   ]
}
```

#### forEach(children : Children | [], mapper(item, index) => any)
The forEach() function executes a provided function once per element in the Children data structure.

#### cloneWithProps(children : Children | [], props : Object | () => Object) => Children
The cloneWithProps() function creates a new Children data structure with the results of cloning each component instance it contains, skipping any non component child. Each clone will have its own props extended with the *props* argument.

If the *props* argument is a function, that function will be called with the child component's props as an argument and its return value will be used as the props argument.

```js
const Echo = function (props) {
  return Object.assign({}, props)
}

const Summarize = function (props) {
  return cloneWithProps(props.children, function (childProps) {
    return { 'NAME': childProps.name.toUpperCase() }
  })
}

compose(
  <Summarize>
    <Echo name="John" />
    {{ name: 'Doe' }}
  </Summarize>  
).then(console.log)
```
The above composition will log the following object to console:
```json
[
  { name: 'John', NAME: 'JOHN' },
  { name: 'Doe' }
]
```

#### reduce(children : Children | [], reducer : (accumulator, item, index) => any, initialValue) => any
The reduce() function applies a function against an accumulator and each element in *children* to reduce it to a single value.
Note that if a child is a component then it will still, at this point, be an unmounted Component Instance.

#### only(children : Children | []) => any
Returns the only child in children. If there are no children or alternatively more than a single child, the function will throw.

### Post Composition
All post composition functions are applied *after* composing the child components and return a promise which resolves after applying the operation.

All Post Composition function have an optional argument, *context*, which is the context with which the children will be composed.
If omitted, all functions will inherit the context of the current component. 

#### reduceComposed(children : Children | [], reducer : (accumulator, item, index) => any, initialValue, context) => any
The reduceComposed() function applies a function against an accumulator and the return value of each composed element in *children* to reduce it to a single value.

```js
const AgeFetcher = ({ entity }) => {
  /* 
    The Age api returns the age of the entity.
    Lets assume the ages are: 50 (father), 22 (daughter), 3 (dog)
   */
  return fetch(`ageApi.com/getAgeOf/${entity}`)
    .then(result => result.age)
}

const Summarize = function ({ children }) {
  return {
    sum: reduceComposed(children, (sum, val) => {
      return sum + val
    }, 0)
  }
}

compose(
  <Summarize>
    <AgeFetcher entity="father" />
    <AgeFetcher entity="daughter" />
    <AgeFetcher entity="dog" />
  </Summarize>
).then(console.log)
```
The above composition will log the following object to console:
```json
{ sum: 75 }
```
#### mapComposed(children : Children | [], mapper : (item, index) => [], context) => []
The mapComposed() function returns an creates a new array with the results of calling a provided function on the return value of the composition of each child.
A promise is returned by *mapComposed* which will resolve with the new array after all children are composed and the mapper has been applied to their result.
If no mapper function is provided then *mapComposed* uses the *identity* function, basically providing an easy way to compose all children into an array.

#### onlyComposed(children : Children | [], context) => any
Composes all the elements in the children data structure and returns the only *none-undefined* return value of the various children. If there are no return values or alternatively more than a single return value, the function will throw.

This is very useful when you want to allow the developer using your components the freedom to compose your component with whatever they want, but still enforce an API where you only actually accept one single return value from your composed children.
```js
const DumbComponent = function ({ isValid }) {
  if(isValid) {
    return `Some Valid Component`
  }
}
const TheOnlyChild = function (props) {
  return {
    only: onlyComposed(props.children)
  }
}

compose(
  <TheOnlyChild>
    <DumbComponent isValid={true} />
    <DumbComponent isValid={false} />
    <DumbComponent isValid={false} />
  </TheOnlyChild>
).then(console.log)
```

The above composition will log the following object to console:
```json
{ only: "Some Valid Component" }
```
