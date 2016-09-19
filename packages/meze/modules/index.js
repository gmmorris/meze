
import { Component } from './Component'
import createComponent from './createComponent'
import children from './children'
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
  children,
  utilities,
  compose
}

export default Meze
