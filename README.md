# meze ![alt TravisCI Build](https://travis-ci.org/gmmorris/meze.svg?branch=master)

***This is still VERY MUCH a Work In Progress***

***Meze***, a word with its roots in antiquity, describes a selection of small dishes served accompanying alcoholic drinks, whose purpose is three-fold: to complement and enhance the taste of the drink, to provide the backdrop for a social gathering and to decouple the implementation of the individual dishes so that they may be consumed by the hungry developer in whichever way suits them the best.

The above is as true for real life *Meze* as for it's Javascript counterpart.

Born out of a thought experiment, *Meze* provides the Component Composition API popularized by the *React* library in order to declaratively compose data and process. *Meze* is designed to make it painless to express complex operations while striving for the simplicity of functional composition.

## Key Features
* ***Stateless Components*** maintain the standard *React API*, with slight changes to better reflect their purpose as implementations of data & process ,rather than stateful UI
* ***Meze.compose*** mounts a component tree which reduces down to a single return value
* Asynchronous processes are seamlessly supported via a *Promise based API* between composed component trees
* Fully supports *JSX* in order to make adoption as seamless as possible for developers already used to the syntax and developer experience of React
* [*Banquet*](https://github.com/gmmorris/meze/tree/master/packages/banquet), a *Meze* based wrapper for the superb [Restify](http://restify.com/) library, is available to make it easy to get started building a *REST* service using **Meze**
* Supports all of the paradigms we've come to love about working with React, ranging from Component Composition to Higher Order Components

## Why
The most obvious question in regards to Meze is - why would we want to add it to our stack?
Meze was born out of a thought experiment, which like all experiments, starts with a Research Question, which was:

> How could the Component Composition we've grown to appreciate in building our UIs be used to build more declarative, less cohesively coupled code in our server side code as well.

We know, we know, Research Questions are supposed to be more granular and specific but in truth, an abstract question is needed when you're interesting in providing an abstract answer.
The key difference between React and what we're looking for is that React is designed for long lived component trees with every changing state, while what we need for our server side processes is something slightly different.
What we need is a pipe line of operations, resulting in some kind of result and often, some side effects too. This called for a very different implementation approach from what React could provide.
That said, the Component Composition API, which is the basis of what separates React, Inferno and similar libraries from other UI focused libraries, is very intuitive, generic enough to suit our needs and most importantly - has received wide adoption and so would make onboarding new developers into the Meze ecosystem easier.

So what we've built is a library using the familiar Component Composition API with *unidirectional data flow and separation of concerns* whose internal implementation is designed as a *compose & reduce* operation rather than a long lived tree of flowing state.

## Install
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

## Basic Usage

If you have experience using React then you should feel comfortable jumping right into Meze.

### A Simple Component
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
Suffice to say we're very pleased about Promises becoming an official Javascript primitive, elevating its usage to what we consider ubiquitous.

### A Composition of Components
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

### Basic usage of Children
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

## Banquet
An example of using Banquet with Meze can be found here:
[*Meze & Banquet Example*](https://github.com/gmmorris/meze-banquet-example)

 
