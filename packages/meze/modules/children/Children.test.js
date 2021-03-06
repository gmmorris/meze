import test from 'ava'

import Meze from '../index'

import compose from '../compose'
import { isInstanceOf } from '../Component'
import Children, { asChildren, isChildren } from './Children'
import { forEach, mapComposed, cloneWithProps, map, mapToArray } from './mapping'
import { reduceComposed } from './reduction'
import { only, onlyComposed } from './only'
import { filter } from './filter'

// Children tests
test('The Children data structure should wrap an array', t => {
  const children = new Children([
    1, 2, 3
  ])
  t.deepEqual(
    children.children,
    [1, 2, 3]
  )
  t.deepEqual(
    children.length,
    3
  )
})

test('The Children data structure should be iterable', t => {
  const children = new Children([
    1, 2, 3
  ])

  const iter = children[Symbol.iterator]()
  t.deepEqual(iter.next().value, 1)
  t.deepEqual(iter.next().value, 2)
  t.deepEqual(iter.next().value, 3)
  t.truthy(iter.next().done)
})

test('map applies a function to an array and marks the array as a ChildArray', t => {
  const maped = map([
    1, 2, 3
  ], i => i)
  t.true(isChildren(maped))
})

test('map applies the identity when no mapper function is provided', t => {
  const maped = map([
    1, 2, 3
  ])
  t.true(isChildren(maped))
})

test('map passes context into newly mapped components', async t => {
  const Echo = function (props, context) {
    return { ctx: context.ctx , ...props }
  }

  const Origin = function (props) {
    return { ...props }
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

test('map returns a new children object with context on it', async t => {
  const EchoWithContext = function (props, context) {
    return { ctx: context.ctx , ...props }
  }

  const Origin = function (props) {
    return { ...props }
  }

  const Summarize = function (props) {
    return mapComposed(
      map(props.children, child => <EchoWithContext {...child.props} />),
      child => {
        child.composed = true
        return child
      })
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
      { name: 'John', ctx: true, composed: true },
      { name: 'Doe', ctx: true, composed: true }
    ]
  )
})

test('cloneWithProps passes context into newly cloned Children object', async t => {
  const Echo = function (props, context) {
    return { ...props, name: context.capitalise(props.name)}
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
    {
      capitalise: name => (name === 'John' ? name.toUpperCase() : name)
    }
  )

  t.deepEqual(
    actual,
    {
      contents: [
        { name: 'JOHN' },
        { name: 'Doe' }
      ],
      extendedContents: [
        { name: 'JOHN', hey: 'ho' },
        { name: 'Doe', hey: 'ho' }
      ]
    }
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

test('forEach cycles through all elements in the children object', async t => {
  const Echo = () => {}
  const Validate = function ({ children }) {
    let count = 0
    forEach(children, child => {
      t.truthy(child.props.isValid)
      count++
    })
    return count === children.length
  }

  const actual = await compose(
    <Validate>
      <Echo isValid={true} />
      <Echo isValid={true} />
    </Validate>
  )

  t.deepEqual(
    actual,
    true
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

test('filter returns a Children object where all children are truthy for the filter function', async t => {
  const Dumb = function ({ id }) {
    return { id, areYouADumbComponent: true }
  }

  const NotDumb = function (props) {
    return { areYouADumbComponent: false }
  }

  const TheDumbChildren = function (props) {
    return filter(props.children, isInstanceOf(Dumb))
  }

  t.deepEqual(
    await compose(
      <TheDumbChildren>
        <Dumb id={1} />
        <NotDumb id={1} />
        <Dumb id={2} />
        <Dumb id={3} />
      </TheDumbChildren>
    ),
    [
      { id: 1, areYouADumbComponent: true },
      { id: 2, areYouADumbComponent: true },
      { id: 3, areYouADumbComponent: true }
    ]
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
      <Dumb someProp="123" someOtherProp={{ asd: 1}} />
      <Dumb>
        <Dumb>
          <Dumb />
        </Dumb>
      </Dumb>
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

test('mapComposed passes the context down to the reduced children', async t => {
  const EchoVal = ({ val }, { add }) => val + add
  const Summarize = function ({ children }) {
    return mapComposed(children, (val) => {
      return val
    })
  }

  const actual = await compose(
    <Summarize>
      <EchoVal val={1} />
      <EchoVal val={2} />
      <EchoVal val={3} />
    </Summarize>,
    { add: 1 }
  )

  t.deepEqual(
    actual,
    [2, 3, 4]
  )
})
