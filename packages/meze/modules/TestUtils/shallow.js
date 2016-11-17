import isPlainObject from 'lodash.isplainobject'
import isArray from 'lodash.isarray'
import isEmpty from 'lodash.isempty'
import isObjectLike from 'lodash.isobjectlike'
import isFunction from 'lodash.isfunction'

import { Component, isComponent } from '../Component'
import { isComponentInstance } from '../ComponentInstance'
import { supportsComponentisation } from '../utilities/componentise'

const INVALID_ARG_COMPONENT_DEFINITION = `Component Definitions can't be shallow composed directly. Try using the <ComponentDefinition /> syntax`
const INVALID_ARG_OTHER = `Only Meze components may be provided to the shallow composer`

const isInvalidComponent = component =>
  isComponent(component) || supportsComponentisation(component)

export default (component, context) => isComponentInstance(component)
  ? Promise.resolve(compose(component, context))
  : Promise.reject(new Error(
      isInvalidComponent(component) ? INVALID_ARG_COMPONENT_DEFINITION : INVALID_ARG_OTHER
    )
)

function mountComponent (component, context) {
  return component(context).composition
}

function defineFind (composition) {
  return (selector) => {
    if (isComponent(selector) || isFunction(selector)) {
      if (isComponentInstance(composition)) {
        return composition.instanceOf(selector)
          ? defineCompositionWrapper(composition)
          : defineCompositionWrapper()
      } else if (isPlainObject(composition)) {
        console.log('object')
      } else {
        console.log(composition)
      }
    }
  }
}

function defineCompositionWrapper (composition, context) {
  return {
    composition,
    isEmpty: () => composition === undefined,
    props: () => composition.props,
    context: () => context,
    find: defineFind(composition)
  }
}

function compose (component, context = {}) {
  return new Promise((resolve, reject) => {
    resolve(
      defineCompositionWrapper(
        mountComponent(component, {
          compose: (innerCompose, innerContext) => defineCompositionWrapper(innerCompose, innerContext),
          ...context
        }),
        context
      )
    )
  })
}
