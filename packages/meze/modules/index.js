
import { Component } from './Component'
import createComponent from './createComponent'
import Children from './Children'
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
  Component,
  createComponent,
  Children,
  utilities,
  compose
}

export default Meze
