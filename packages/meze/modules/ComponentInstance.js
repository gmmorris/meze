/* @flow */

import symbolPainter from './internals/symbolPainter'
import extendWithMiddleware from './internals/middlewareExtender'
import { isNonEmptyArray } from './utilities/validations'
import compose from './compose'
import createComponent from './createComponent'

import type { ComponentConstructorType, ComponentPropType } from './Component'
import type { componentCreatorType } from './createComponent'

const { paint, painted } = symbolPainter('ComponentInstance')
const { paint: paintConstruct, painted: paintedConstruct } = symbolPainter('ComponentInstance$constructed')
const { paint: paintWithMiddleware, painted: paintedWithMiddleware } = symbolPainter('ComponentInstanceMiddleware')

type InstanceConstructionType = () => Promise<*>
export type ComponentInstanceType =
  InstanceConstructionType &
  {
    props: ComponentPropType,
    clone: (cloneProps : ComponentPropType, ...cloneChildren : any[]) => componentCreatorType,
    enableMiddleware: () => InstanceConstructionType
  }

export const isComponentInstance =
  (instance : any) : boolean => instance && painted(instance)

export default function (constructor: ComponentConstructorType, props: ComponentPropType) : ComponentInstanceType {
  // console.log(`$$ComponentInstance`)
  // console.log(arguments)
  const mount = () => {
    if (paintedConstruct(this)) {
      throw Error('Components cannot be instanciated twice')
    }
    paintConstruct(this)
    return Promise.resolve(compose(constructor(props)))
      .then(res => paintedWithMiddleware(this)
      ? this.applyMiddleware(res)
      : res)
  }

  mount.enableMiddleware = () => {
    if (!paintedWithMiddleware(this)) {
      paintWithMiddleware(this)
      this.applyMiddleware = extendWithMiddleware(mount)
    }
    return mount
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
