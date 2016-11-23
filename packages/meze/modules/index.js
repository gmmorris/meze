import { Component, isComponent } from './Component'
import createComponent from './createComponent'
import Children from './Children'
import PropTypes from './PropTypes'
import { Assign } from './utilities/assign'
import { componentise } from './utilities/componentise'
import { Objectify, objectifyMiddleware } from './utilities/objectify'
import compose from './compose'

createComponent
  .addComponentisationMiddleware(componentise)
  .addComponentisationMiddleware(objectifyMiddleware)

const utilities = {
  Assign,
  Objectify
}

const Meze = {
  PropTypes,
  Component,
  isComponent,
  createComponent,
  Children,
  utilities,
  compose
}

export {
  PropTypes,
  Component,
  isComponent,
  createComponent,
  Children,
  utilities,
  compose
}
export default Meze
