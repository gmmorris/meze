/* @flow */
import isFunction from 'lodash.isfunction'

import { isError } from '../utilities/validations'
import { isComponent } from '../Component'
import { isComponentInstance } from '../ComponentInstance'
import type { ComponentType } from '../Component'

import chainableTypeChecker from './chainableTypeChecker'
import { PropTypeLocationNames } from './PropTypes'

const asConstructor = (
    component : Function | ComponentType,
    componentName : string,
    location : string) : Function | Error =>
  isComponent(component) || isComponentInstance(component)
    ? component.constructor
    : isFunction(component)
      ? component
      : new Error(`${location} \`${componentName}\` is not a Component Instance.`)

export const componentOf = (componentConstructor : Function | ComponentType) : Function =>
  (props : Object, prop : string, component : string, location : string) : boolean | Error => {
    const expectedType = asConstructor(componentConstructor, prop, PropTypeLocationNames[location])
    const actualType = isComponentInstance(props[prop])
      ? asConstructor(props[prop], prop, PropTypeLocationNames[location])
      : new Error(`${PropTypeLocationNames[location]} \`${prop}\` is not a Component Instance.`)
    return isError(expectedType)
      ? expectedType
      : isError(actualType)
        ? actualType
        : (actualType === expectedType)
          ? true
          : new Error(`${PropTypeLocationNames[location]} \`${prop}\` is not of the correct Component type.`)
  }

const onRequirementFailed = (props : Object, prop : string, component : string, location : string, propFullName : string) : Error =>
  new Error(
    `Required ${PropTypeLocationNames[location]} \`${propFullName}\` was not specified in \`${component}\`.`
  )

export default (componentConstructor : Function) : Function =>
  chainableTypeChecker(componentOf(componentConstructor), onRequirementFailed)
