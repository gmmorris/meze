
import { Component } from './Component'
import createComponent from './createComponent'
import Children from './children'
import { Assign } from './utilities/assign'
import compose from './compose'

// let index = 0
// const Child = Component(({ index }) => `Some component at index ${index}`)
// compose(
//     createComponent(
//       Children.Assign,
//       {},
//       createComponent(Child, { index: index++ }),
//       createComponent(Child, { index: index++ }),
//       createComponent(Child, { index: index++ }),
//       createComponent(Child, { index: index++ }),
//       createComponent(Child, { index: index++ })
//     )
//   ).then(res => console.log(res))

const utilities = {
  Assign
}

const Meze = {
  Component,
  createComponent,
  Children,
  utilities,
  compose
}

export default Meze
