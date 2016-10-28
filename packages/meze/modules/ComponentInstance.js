/* @flow */

import symbolPainter from './internals/symbolPainter'
import { isNonEmptyArray } from './utilities/validations'
import compose from './compose'
import createComponent from './createComponent'

import type { ComponentConstructorType, ComponentPropType } from './Component'
import type { componentCreatorType } from './createComponent'

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

export default function (constructor: ComponentConstructorType, displayName: string, props: ComponentPropType) : ComponentInstanceType {
  // console.log(`$$ComponentInstance`)
  // console.log(arguments)
  const mount = () => {
    // console.log(`mounting: ${displayName}`)
    if (paintedConstruct(this)) {
      throw Error('a Component Instance cannot be mounted twice')
    }
    paintConstruct(this)
    return compose(constructor(props))
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
