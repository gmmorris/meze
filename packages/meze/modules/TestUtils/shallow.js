
import { isComponent } from '../Component'
import { isComponentInstance } from '../ComponentInstance'

const INVALID_ARG_COMPONENT_DEFINITION = `Component Definitions can't be shallow composed directly. Try using the <ComponentDefinition /> syntax`
const INVALID_ARG_OTHER = `Only Meze components may be provided to the shallow composer`

export default component => isComponentInstance(component)
  ? component()
  : Promise.reject(new Error(
      isComponent(component) ? INVALID_ARG_COMPONENT_DEFINITION : INVALID_ARG_OTHER
    )
)
