# Basic Usage

If you have experience using React then you should feel comfortable jumping right into Meze.

## A Simple Component
Meze only supports Stateless Component, as we want to encourage pure stateless operations. Just as with React, the usage of JSX is optional, but we find its usage makes it easier for React developers to reason about Meze code.

```js
import Meze from 'meze'

const GetPersonalisedMessage = (props) => {
  return `Hello ${props.name}, we're speaking via composition`
}

Meze
  .compose(<GetPersonalisedMessage name="Hummus" />)
  .then(result => {
    console.log(result)
  })

```

The above should print out the following message into the console.
> Hello Hummus, we're speaking via composition

Note how the API of the *Meze.compose* method is that it takes a single component instance and returns a promise. All component trees start at a single root component, just like React, but the resolution is assumed to be asynchronous hence the main interaction with the library is via Promises.
Suffice to say we're very pleased about Promises becoming a built-in Javascript type, elevating its usage to what we consider ubiquitous.

## A Composition of Components
Meze builds a component tree by mounting the root component, and then mounting every child component in the components return value. It continues with this operation all the way up (or down, depends how you look at it) until it "reaches the tree top", which is to say it runs out of components to mount.
Once it has mounted all the components it begins a reduction process by which the return values of each component are returned to its parent component all the way down to the root.
This means that, unlike in React (where Components don't care what their children render, as they do nothing more than "contain them"), a Meze Component *might* be more conscious of what it expects to receive from its child components, but that is not always the case.

In the more advanced topics of this documentation we discuss considerations for how much a component might need or want to know about its children, but it is imporant to understand that unlike React, where the component tree results in the construction of a DOM tree in the browser, Meze component trees reduce into a single value and hence components are usually more involved in the return values of the components they are composed with.

This should be intuitive to developers who are used to composing functions, but we're sure you'll get the hang of it quickly if you're not.

Let's look at an example.

```js
import Meze, { compose } from 'meze'

const RandomNumberBetweenFloorAndCeiling = ({ ceil, floor }) => {
  return {
    ceil,
    randomNumber: <GetRandomNumber ceil={ceil} floor={floor} />
    floor
  }
}

const GetRandomNumber = ({ ceil, floor }) => {
  return Math.random() * (ceil - floor) + floor
}

Meze.compose(<RandomNumberBetweenFloorAndCeiling ceil={100} floor={50} />)
  .then(result => {
    console.log(result)
  })

```

The above should print out the message similar to the following into the console (similar, because we can't predict the value of Random, can we?).
```js
Object {floor: 50, randomNumber: 86.70486272192622, ceil: 100}
```

## Basic usage of Children
Every component can be composed with an arbitrary number of children.
If any children are provided then a *children* property will be passed into the Meze component when it's mounted.

The following is a simple example of how this may be used.
```js
import Meze, Children, { compose } from 'meze'

const Echo = function (props) {
  return Object.assign({}, props)
}

const Summarize = function ({ children }) {
  return {
    contents: Children.mapToArray(children),
    extendedContents: Children.cloneWithProps(children, { hey: 'ho' })
  }
}

compose(
    <Summarize>
      <Echo name="John" />
      <Echo name="Doe" />
    </Summarize>
  )
  .then(result => {
    console.log(result)
  })

```

The above should print out the message similar to the following into the console.
```js
Object {
      contents: [
        { name: 'John' },
        { name: 'Doe' }
      ],
      extendedContents: [
        { name: 'John', hey: 'ho' },
        { name: 'Doe', hey: 'ho' }
      ]
    }
```

Above is an example of two utilities we provide for working with the Children data structure.
*Children.mapToArray* takes the children prop as an argument and returns an array containing the children instances, while *Children.cloneWithProps* clones each component instance and extends their props with whichever object is provided in the second argument, in our case the object:
```js
{ hey: 'ho' }
```

Please look at the extensive documentation on the Children data structure for a full understanding of the various Children utility functions and their respected usage.