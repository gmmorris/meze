
import { Component } from './Component'
import createComponent from './createComponent'
import Children from './children'
import { Assign } from './utilities/assign'
import { Objectify, createObjectify } from './utilities/objectify'
import compose from './compose'

const utilities = {
  Assign,
  Objectify,
  createObjectify
}

const Meze = {
  Component,
  createComponent,
  Children,
  utilities,
  compose
}

export default Meze
