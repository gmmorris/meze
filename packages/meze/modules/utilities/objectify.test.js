import test from 'ava'

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

test('objectify creates an object with its props under a component name', async t => {
  const SomePerson = createObjectify('SomePerson')
  /*
  <Objectify> 
    <SomePerson name="Jack" age={25} occupation="Dancer" />
  </Objectify>
  */
  t.deepEqual(
    await compose(
      createComponent(
        Objectify,
        {},
        createComponent(
          SomePerson,
          {
            name: 'Jack',
            age: 25,
            occupation: 'Dancer'
          }
        )
      )
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
  const PersonComponent = createObjectify('Person')
  const OffsprintComponent = createObjectify('Offsprint')
  /*
    <Person name="Jack" age={55} occupation="Dancer">
      <Offsprint>
        <Person name="James" age={15} occupation="Cook" />
        <Person name="Lilly" age={12} occupation="Programmer" />
        <Person name="Harry" age={25} occupation="Photographer" />
      </Offsprint>
    </Person>
  */

  t.deepEqual(
    await compose(
      createComponent(
        PersonComponent,
        {
          name: 'Jack',
          age: 55,
          occupation: 'Dancer'
        },
        createComponent(
          OffsprintComponent,
          {},
          createComponent(
            createObjectify('James'),
            {
              age: 15,
              occupation: 'Cook'
            }
          ),
          createComponent(
            createObjectify('Lilly'),
            {
              age: 12,
              occupation: 'Programmer'
            }
          ),
          createComponent(
            createObjectify('Harry'),
            {
              age: 25,
              occupation: 'Photographer'
            }
          )
        )
      )
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
