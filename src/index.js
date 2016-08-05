
import Component, { createComponent } from './Component'

const Complex = Component(function (props, children) {
  const { left, right } = props
  const val = left < right
    ? 'smaller'
    : (left > right
      ? 'larger'
      : 'equal')
  return val
})

const rand = () => parseInt(Math.random() * 100)

const Root = Component(function (props, children) {
  const { left = rand(), right = rand() } = props
  return {
    left,
    right,
    comparison: createComponent(Complex, {left, right})
  }
})

console.log(createComponent(Root, { right: 49 }))
