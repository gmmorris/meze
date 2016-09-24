import test from 'ava'

import Meze from './index'
import { Component } from './Component'
import compose from './compose'
import { isChildrenArray, reduceComposed, cloneWithProps } from './children'

// Children tests
test('map applies a function to an array and marks the array as a ChildArray', t => {
  const maped = Meze.children.map([
    1, 2, 3
  ], i => i)
  t.true(isChildrenArray(maped))
})

test('map applies the identity when no mapper function is provided', t => {
  const maped = Meze.children.map([
    1, 2, 3
  ], i => i)
  t.true(isChildrenArray(maped))
})

test('cloneWithProps clones a component instance and applies the additional props to it', async t => {
  const Echo = Component(function (props) {
    return Object.assign({}, props)
  })

  const Summarize = Component(function (props) {
    return {
      contents: Meze.children.map(props.children),
      extendedContents: Meze.children.cloneWithProps(props.children, { hey: 'ho' })
    }
  })

  t.deepEqual(
    await compose(
      <Summarize>
        <Echo name="John" />
        <Echo name="Doe" />
      </Summarize>
    ),
    {
      contents: [
        { name: "John" },
        { name: "Doe" }
      ],
      extendedContents: [
        { name: "John", hey: "ho" },
        { name: "Doe", hey: "ho" }
      ]
    }
  )
})

test('cloneWithProps can take a function which it uses to compute props for the clones', async t => {
  const Echo = Component(function (props) {
    return Object.assign({}, props)
  })

  const Summarize = Component(function (props) {
    return {
      contents: Meze.children.map(props.children),
      extendedContents: Meze.children.cloneWithProps(props.children, (childProps) => (
        { 'NAME' : childProps.name.toUpperCase() }
      ))
    }
  })

  t.deepEqual(
    await compose(
      <Summarize>
        <Echo name="John" />
        <Echo name="Doe" />
      </Summarize>
    ),
    {
      contents: [
        { name: "John" },
        { name: "Doe" }
      ],
      extendedContents: [
        { name: "John", NAME: "JOHN" },
        { name: "Doe", NAME: "DOE" }
      ]
    }
  )
})

test('ChildArrays are flattened when passed to a component', async t => {
  const Summarize = Component(function (props) {
    const { children } = props
    return {
      contents: children
    }
  })

  t.deepEqual(
    await compose(
      <Summarize>
        {
          Meze.children.map([
            1, 2, 3
          ])
        }
      </Summarize>
    ),
    { contents: [1, 2, 3] }
  )
})

test('reduceComposed composes childen of a component and applied a reducer to their results', async t => {

  const PosponedComp = Component(props => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(props.val)
      }, parseInt(Math.random()*100))
    })
  }) 

  const Summarize = Component(function (props) {
    const { children } = props
    return {
      sum: reduceComposed(children, (sum, val) => {
        return sum + val
      }, 0)
    }
  })

  t.deepEqual(
    await compose(
      <Summarize>
        <PosponedComp val={1} />
        <PosponedComp val={2} />
        <PosponedComp val={3} />
      </Summarize>
    ),
    { sum: 6 }
  )
})
