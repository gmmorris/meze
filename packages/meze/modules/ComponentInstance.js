/* @flow */
import isFunction from 'lodash.isfunction'
import symbolPainter from './internals/symbolPainter'
import { isNonEmptyArray } from './utilities/validations'
import createComponent from './createComponent'

import type { ComponentConstructorType, ComponentPropType } from './Component'
import type { componentCreatorType } from './createComponent'
import type { Composer } from './compose'

const { paint, painted } = symbolPainter('ComponentInstance')
const { paint: paintConstruct, painted: paintedConstruct } = symbolPainter('ComponentInstance$constructed')

type InstanceConstructionType = () => Promise<*>
export type ComponentInstanceType =
  InstanceConstructionType &
  {
    props: ComponentPropType,
    clone: (cloneProps : ComponentPropType, ...cloneChildren : any[]) => componentCreatorType
  }

export const isComponentInstance =
  (instance : any) : boolean => instance && painted(instance)

const callIfFunction = (fn, ...args) => fn && isFunction(fn) ? fn(...args) : false
const promisedIdentity = i => Promise.resolve(i)

export default function (constructor: ComponentConstructorType, displayName: string, props: ComponentPropType) : ComponentInstanceType {
  // console.log(`$$ComponentInstance`)
  // console.log(arguments)
  const mount = (compose : Composer = promisedIdentity) => {
    // console.log(`mounting: ${displayName}`)
    callIfFunction(props.componentWillMount)
    if (paintedConstruct(this)) {
      throw Error(`A ${displayName} Component Instance cannot be mounted twice`)
    }
    paintConstruct(this)
    const mountResult = constructor(props)
    callIfFunction(props.componentDidMount)
    let result = compose(mountResult)
    return props.componentWillUnmount
      ? result
        .then(res => {
          callIfFunction(props.componentWillUnmount, res)
          return res
        })
      : result
  }

  mount.clone = function (cloneProps : ComponentPropType = {}, ...cloneChildren : any[]) : componentCreatorType {
    const { children, ...originalProps } = props
    return createComponent(
      constructor,
      { ...originalProps, ...cloneProps },
      ...(isNonEmptyArray(cloneChildren) ? cloneChildren : (children || []))
    )
  }

  mount.props = Object.freeze(props)

  return paint(mount)
}
