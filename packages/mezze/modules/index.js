
import { Component } from './Component'
import createComponent from './createComponent'
import Children from './children'
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

const Mezze = {
  Component,
  createComponent,
  Children,
  compose
}

export default Mezze
