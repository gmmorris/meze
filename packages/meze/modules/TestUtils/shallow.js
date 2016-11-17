import { isComponent } from '../Component'
import { isComponentInstance } from '../ComponentInstance'
import { supportsComponentisation } from '../utilities/componentise'
import CompositionWrapper from './CompositionWrapper'

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

function compose (component, context = {}) {
  return new Promise((resolve, reject) => {
    resolve(
      CompositionWrapper(
        mountComponent(component, {
          compose: (innerCompose, innerContext) => CompositionWrapper(innerCompose, innerContext),
          ...context
        }),
        context
      )
    )
  })
}
