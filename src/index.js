
import { Component, createComponent } from './Component'
import { composeTree } from './ComponentTree'

const Eunoia = {
  Component,
  createComponent,
  composeTree
}

export default Eunoia

const Complex = function (props) {
  const { left, right } = props;
  const val = left < right ? 'smaller' : left > right ? 'larger' : 'equal';
  return val;
};

const Root = Eunoia.Component(function (props) {
  const { left, right } = props;
  return {
    left,
    right,
    comparison: Eunoia.createComponent(Complex, { left: left, right: right })
  };
});

const composition = Eunoia.composeTree(Eunoia.createComponent(Root, { left: 40, right: 50 }));

composition.then(x => console.log(x));


// import { Component, createComponent } from './Component'
// import { composeTree } from './ComponentTree'

// const Complex = function (props) {
//   const { children } = props
//   console.log(children.length)
//   const { left, right } = props
//   const val = left < right
//     ? 'smaller'
//     : (left > right
//       ? 'larger'
//       : 'equal')
//   return val
// }

// const Root = Component(function (props) {
//   const { left, right } = props
//   return {
//     left,
//     right,
//     comparison: createComponent(Complex, {left, right})
//   }
// })

// const composition = composeTree(createComponent(Root, { left: 40, right: 50 }))

// composition.then(res => {
//   console.log('-----')
//   console.log(res)
// })

// import flattenPromises from './FlattenPromises'

// const testObj = {
//   a: 1,
//   b: Promise.resolve(2),
//   c: {
//     d: Promise.resolve(3),
//     e: new Promise(resolve => {
//       setTimeout(() => resolve(4), 100)
//     }),
//     f: Promise.resolve({
//       h: Promise.resolve(3)
//     })
//   }
// }

// const resObj = {
//   a: 1,
//   b: Promise.resolve(2),
//   c: {
//     d: Promise.resolve(3),
//     e: new Promise(resolve => {
//       setTimeout(() => resolve(4), 100)
//     }),
//     f: Promise.resolve({
//       h: Promise.resolve(5)
//     })
//   }
// }
// const result = Promise.resolve(testObj)

// flattenPromises(result)
//   .then((...args) => console.log(...args))
