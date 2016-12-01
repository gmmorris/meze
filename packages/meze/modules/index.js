import { Component, isComponent } from './Component'
import createComponent from './createComponent'
import Children from './Children'
import PropTypes from './types/PropTypes'
import { Assign } from './utilities/assign'
import { componentise } from './utilities/componentise'
import TestUtils from './TestUtils'
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
  compose,
  TestUtils
}

export {
  PropTypes,
  Component,
  isComponent,
  createComponent,
  Children,
  utilities,
  compose,
  TestUtils
}
export default Meze
