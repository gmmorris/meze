import test from 'ava'
import Meze from '../index'

import { Component, isComponent } from '../Component'
import createComponent from '../createComponent'
import compose from '../compose'
import { Objectify, createObjectify, isPlainObjectComponent } from './objectify'

// Objectify
test('createObjectify is a function that returns a Component', t => {
  t.true(
    typeof createObjectify === 'function'
  )
  t.true(
    isComponent(createObjectify('generic'))
  )
})

test('isPlainObjectComponent should differenciate between plainObjectComponents and regular Components', async t => {
  const SomeComponent = Component(() => {})
  t.true(
    isPlainObjectComponent(await compose(createComponent(createObjectify('generic'))))
  )

  t.false(
    isPlainObjectComponent(createComponent(SomeComponent)())
  )
})

test('Objectify is used to create a generic component when an unknow Component is composed', async t => {
  t.deepEqual(
    await compose(
      <topObject>
        <person name="Jack" age={25} occupation="Dancer" />
      </topObject>
    ),
    {
      person: {
        name: 'Jack',
        age: 25,
        occupation: 'Dancer'
      }
    }
  )
})

test('objectify creates an object with its props under a component name', async t => {
  const SomePerson = createObjectify('SomePerson')

  t.deepEqual(
    await compose(
      <Objectify>
        <SomePerson name="Jack" age={25} occupation="Dancer" />
      </Objectify>
    ),
    {
      SomePerson: {
        name: 'Jack',
        age: 25,
        occupation: 'Dancer'
      }
    }
  )
})

test('Objectify creates an object with its props under a component name', async t => {
  const Person = createObjectify('Person')
  const Offsprint = createObjectify('Offsprint')
  const James = createObjectify('James')
  const Lilly = createObjectify('Lilly')
  const Harry = createObjectify('Harry')

  t.deepEqual(
    await compose(
      <Person name="Jack" age={55} occupation="Dancer">
        <Offsprint>
          <James age={15} occupation="Cook" />
          <Lilly age={12} occupation="Programmer" />
          <Harry age={25} occupation="Photographer" />
        </Offsprint>
      </Person>
    ),
    {
      name: 'Jack',
      age: 55,
      occupation: 'Dancer',
      Offsprint: {
        James: {
          age: 15,
          occupation: 'Cook'
        },
        Lilly: {
          age: 12,
          occupation: 'Programmer'
        },
        Harry: {
          age: 25,
          occupation: 'Photographer'
        }
      }
    }
  )
})
