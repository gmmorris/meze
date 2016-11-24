import test from 'ava'

import Meze from './index'

import compose from './compose'
import { asChildren, isChildrenArray, reduceComposed, cloneWithProps, only, onlyComposed, map, mapToArray } from './Children'

// Children tests
test('map applies a function to an array and marks the array as a ChildArray', t => {
  const maped = map([
    1, 2, 3
  ], i => i)
  t.true(isChildrenArray(maped))
})

test('map applies the identity when no mapper function is provided', t => {
  const maped = map([
    1, 2, 3
  ])
  t.true(isChildrenArray(maped))
})

test('map passes context into newly mapped components', async t => {
  const Echo = function (props, { ctx }) {
    return Object.assign({ ctx }, props)
  }

  const Origin = function (props) {
    return Object.assign({}, props)
  }

  const Summarize = function (props) {
    return map(props.children, child => <Echo {...child.props} />)
  }

  const actual = await compose(
    <Summarize>
      <Origin name="John" />
      <Origin name="Doe" />
    </Summarize>,
    { ctx: true }
  )

  t.deepEqual(
    actual,
    [
      { name: 'John', ctx: true },
      { name: 'Doe', ctx: true }
    ]
  )
})

test('cloneWithProps clones a component instance and applies the additional props to it', async t => {
  const Echo = function (props) {
    return Object.assign({}, props)
  }

  const Summarize = function (props) {
    return {
      contents: mapToArray(props.children),
      extendedContents: cloneWithProps(props.children, { hey: 'ho' })
    }
  }

  const actual = await compose(
    <Summarize>
      <Echo name="John" />
      <Echo name="Doe" />
    </Summarize>
  )

  t.deepEqual(
    actual,
    {
      contents: [
        { name: 'John' },
        { name: 'Doe' }
      ],
      extendedContents: [
        { name: 'John', hey: 'ho' },
        { name: 'Doe', hey: 'ho' }
      ]
    }
  )
})

test('cloneWithProps passes the context down to the clones', async t => {
  const Echo = function (props, { ctx }) {
    return Object.assign({ ctx }, props)
  }

  const Summarize = function (props) {
    return {
      contents: mapToArray(props.children),
      extendedContents: cloneWithProps(props.children, { hey: 'ho' })
    }
  }

  const actual = await compose(
    <Summarize>
      <Echo name="John" />
      <Echo name="Doe" />
    </Summarize>,
    { ctx: true }
  )

  t.deepEqual(
    actual,
    {
      contents: [
        { name: 'John', ctx: true },
        { name: 'Doe', ctx: true }
      ],
      extendedContents: [
        { name: 'John', hey: 'ho', ctx: true },
        { name: 'Doe', hey: 'ho', ctx: true }
      ]
    }
  )
})

test('only returns the only child in the children property', async t => {
  const Dumb = function (props) {
    return { areYouADumbComponent: true }
  }

  const TheOnlyChild = function (props) {
    return {
      only: only(props.children)
    }
  }

  t.deepEqual(
    await compose(
      <TheOnlyChild>
        <Dumb />
      </TheOnlyChild>
    ),
    {
      only: { areYouADumbComponent: true }
    }
  )
})

test('only throws if there is something other than a single child', async t => {
  const Dumb = function (props) {
    return { [props.key]: true }
  }

  const TheOnlyChild = function (props) {
    return {
      only: only(props.children)
    }
  }

  t.throws(compose(<TheOnlyChild />))

  t.throws(compose(
    <TheOnlyChild>
      <Dumb />
      <Dumb />
    </TheOnlyChild>
  ))
})

test('onlyComposed composes an array of components and returns the only one with a return value', async t => {
  const Dumb = function (props) {
    return { areYouADumbComponent: true }
  }

  const TheOnlyChild = function (props) {
    return {
      only: onlyComposed(props.children)
    }
  }

  t.deepEqual(
    await compose(
      <TheOnlyChild>
        <Dumb />
      </TheOnlyChild>
    ),
    {
      only: { areYouADumbComponent: true }
    }
  )
})

test('onlyComposed ignores children which have no return value after composition', async t => {
  const Dumb = function (props) {
    return { areYouADumbComponent: true }
  }
  const EmptyDumb = () => {}

  const TheOnlyChild = function (props) {
    return {
      only: onlyComposed(props.children)
    }
  }

  t.deepEqual(
    await compose(
      <TheOnlyChild>
        <EmptyDumb />
        <Dumb />
        <EmptyDumb />
      </TheOnlyChild>
    ),
    {
      only: { areYouADumbComponent: true }
    }
  )
})

test('onlyComposed passes context down to composed children', async t => {
  const Dumb = function (props, { ctx }) {
    return { areYouADumbComponent: true, ctx }
  }
  const EmptyDumb = () => {}

  const TheOnlyChild = function (props) {
    return {
      only: onlyComposed(props.children)
    }
  }

  t.deepEqual(
    await compose(
      <TheOnlyChild>
        <EmptyDumb />
        <Dumb />
        <EmptyDumb />
      </TheOnlyChild>,
      {
        ctx: true
      }
    ),
    {
      only: { areYouADumbComponent: true, ctx: true }
    }
  )
})

test('onlyComposed throws if there is something other than a single child after composition', async t => {
  const Dumb = function (props) {
    return { areYouADumbComponent: true }
  }
  const EmptyDumb = () => {}

  const TheOnlyChild = function ({ children = asChildren() }) {
    return {
      only: onlyComposed(children)
    }
  }

  t.plan(3)

  t.throws(compose(
    <TheOnlyChild />
  ), /No Children present in Component after composition/)

  t.throws(compose(
    <TheOnlyChild>
      <EmptyDumb />
      <EmptyDumb />
      <Dumb />
      <EmptyDumb />
      <EmptyDumb />
      <Dumb />
    </TheOnlyChild>
  ), /Multiple Children present in Component after composition/)

  t.throws(compose(
    <TheOnlyChild>
      <Dumb />
      <Dumb />
    </TheOnlyChild>
  ), /Multiple Children present in Component after composition/)
})

test('cloneWithProps can take a function which it uses to compute props for the clones', async t => {
  const Echo = function (props) {
    return Object.assign({}, props)
  }

  const Summarize = function (props) {
    return {
      contents: map(props.children),
      extendedContents: cloneWithProps(props.children, (childProps) => (
        { 'NAME': childProps.name.toUpperCase() }
      ))
    }
  }

  t.deepEqual(
    await compose(
      <Summarize>
        <Echo name="John" />
        <Echo name="Doe" />
      </Summarize>
    ),
    {
      contents: [
        { name: 'John' },
        { name: 'Doe' }
      ],
      extendedContents: [
        { name: 'John', NAME: 'JOHN' },
        { name: 'Doe', NAME: 'DOE' }
      ]
    }
  )
})

test('cloneWithProps skips non Components', async t => {
  const Echo = function (props) {
    return Object.assign({}, props)
  }

  const Summarize = function (props) {
    return cloneWithProps(props.children, (childProps) => (
      { 'NAME': childProps.name.toUpperCase() }
    ))
  }

  t.deepEqual(
    await compose(
      <Summarize>
        <Echo name="John" />
        {{ name: 'Doe' }}
      </Summarize>
    ),
    [
      { name: 'John', NAME: 'JOHN' },
      { name: 'Doe' }
    ]
  )
})

test('ChildArrays are flattened when passed to a component', async t => {
  const Summarize = function (props) {
    const { children } = props
    return {
      contents: children
    }
  }

  t.deepEqual(
    await compose(
      <Summarize>
        {
          map([
            1, 2, 3
          ])
        }
      </Summarize>
    ),
    { contents: [1, 2, 3] }
  )
})

test('reduceComposed composes childen of a component and applied a reducer to their results', async t => {
  const PosponedComp = props => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(props.val)
      }, parseInt(Math.random() * 100))
    })
  }

  const Summarize = function (props) {
    const { children } = props
    return {
      sum: reduceComposed(children, (sum, val) => {
        return sum + val
      }, 0)
    }
  }

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

test('reduceComposed passes the context down to the reduced children', async t => {
  const PosponedComp = (props, context) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(props.val + context.val)
      }, parseInt(Math.random() * 100))
    })
  }

  const Summarize = function (props) {
    const { children } = props
    return {
      sum: reduceComposed(children, (sum, val) => {
        return sum + val
      }, 0)
    }
  }

  const actual = await compose(
    <Summarize>
      <PosponedComp val={1} />
      <PosponedComp val={2} />
      <PosponedComp val={3} />
    </Summarize>,
    { val: 1 }
  )

  t.deepEqual(
    actual,
    { sum: 9 }
  )
})
