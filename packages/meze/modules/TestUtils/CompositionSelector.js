import isPlainObject from 'lodash.isplainobject'
import isArray from 'lodash.isarray'
import isFunction from 'lodash.isfunction'
import valuesOf from 'lodash.values'
import { isComponentInstance } from '../ComponentInstance'
import { isComponent } from '../Component'
import { compareObjects, log } from '../utilities/helpers'

function CompositionSelector (component = null, props = null) {
  this.constructor = component
  this.props = props
}
CompositionSelector.prototype = {
  isComponent () {
    return this.constructor !== null
  },
  hasProps () {
    return this.props !== null
  },
  matches (component) {
    if (isComponentInstance(component)) {
      return component.instanceOf(this.constructor) &&
        (!this.hasProps() || compareObjects(component.props, this.props))
    } else if (isComponent(component)) {
      return component.instanceOf(this.constructor)
    } else if (isFunction(component)) {
      return component === this.constructor
    }
  }
}

export default function (selector) {
  if (isComponentInstance(selector)) {
    return new CompositionSelector(selector.constructor, selector.props)
  } else if (isComponent(selector)) {
    return new CompositionSelector(selector.constructor)
  } else if (isFunction(selector)) {
    return new CompositionSelector(selector)
  }
  return new CompositionSelector()
}
