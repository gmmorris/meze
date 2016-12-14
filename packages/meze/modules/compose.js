/* @flow */
import isPlainObject from 'lodash.isplainobject'
import isEmpty from 'lodash.isempty'
import isObjectLike from 'lodash.isobjectlike'
import isFunction from 'lodash.isfunction'
import findIndex from 'lodash.findindex'
import { isComponentInstance } from './ComponentInstance'
import type { ComponentMountingContext } from './ComponentInstance'
import flattenPromises from './internals/flattenPromises'
import { isPromise } from './utilities/isPromise'
import isIterableCollection from './utilities/isIterableCollection'
import symbolPainer from './utilities/symbolPainter'
import { promisedIdentity } from './utilities/helpers'

export type ComposedComponent = Promise<*>
export type Composer = () => ComposedComponent
type ComposableType = any

const { paint, painted : hasAlreadyBeenComposed } = symbolPainer('composed')
const { paint: paintContext, painted: isContext } = symbolPainer('compose$context')

const isComplex = (obj : Object | Function) : boolean => isObjectLike(obj) || isFunction(obj)
function hasComplexProperties (obj : Object) : boolean {
  return findIndex(Object.keys(obj), key => {
    return isComplex(obj[key])
  }) >= 0
}

function composeObject (obj : Object, context : ComponentMountingContext) : Object {
  Object
    .keys(obj)
    .forEach(key => {
      obj[key] = isComplex(obj[key]) ? flattenComposition(obj[key], context) : obj[key]
    })
  return obj
}

const getComposerFromContext = context => context.compose ? context.compose : promisedIdentity

const composeIterable =
  (component : Iterable<ComposableType>, context : ComponentMountingContext) : Iterable<ComposableType> =>
    Array.from(component, innerComponent => flattenComposition(innerComponent, context))

const composePlainObject = (component : Object, context : ComponentMountingContext) : ComposableType => {
  return isEmpty(component) || !hasComplexProperties(component)
    ? component
    : flattenPromises(composeObject(component, context))
}

function mountComponent (component, context) {
  const { composition, onComposed } = component(context)
  return onComposed(getComposerFromContext(context)(composition, context))
}

function flattenComposition (component : any, context: ComponentMountingContext) : ComposableType | Array<ComposableType> {
  if (!hasAlreadyBeenComposed(component)) {
    if (isPlainObject(component)) {
      return composePlainObject(component, context)
    } else if (isIterableCollection(component)) {
      return composeIterable(component, context)
    } else if (isPromise(component)) {
      return component
        .then(res => flattenComposition(res, context))
    } else if (isComponentInstance(component)) {
      return mountComponent(component, context)
        .then(res => flattenComposition(res, context))
    }
  }
  return component
}

const DEFAULT_CONTEXT = paintContext({ compose })
function ensureContext (context: ?ComponentMountingContext | Object) : ComponentMountingContext {
  return context && isContext(context)
    ? context
    : (
      isPlainObject(context)
      ? paintContext({ compose, ...context })
      : DEFAULT_CONTEXT
    )
}

function compose (component : any, context: ?ComponentMountingContext) : ComposedComponent {
  return flattenPromises(flattenComposition(component, ensureContext(context)))
    .then(res => Promise.resolve(paint(res)))
}

export default compose
