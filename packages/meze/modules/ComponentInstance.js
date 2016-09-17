/* @flow */

import symbolPainter from './internals/symbolPainter'
import extendWithMiddleware from './internals/middlewareExtender'
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

const originalChildrenOrFreshChildren =
  (original : any[], fresh : any[]) : any[] => (fresh.length ? fresh : (original && original.length ? original : []))

export default function (constructor: ComponentConstructorType, props: ComponentPropType) : ComponentInstanceType {
  // console.log(`$$ComponentInstance`)
  // console.log(arguments)
  const construct = () => {
    if (paintedConstruct(this)) {
      throw Error('Components cannot be instanciated twice')
    }
    paintConstruct(this)
    return Promise.resolve(compose(constructor(props)))
      .then(res => paintedWithMiddleware(this)
      ? this.applyMiddleware(res)
      : res)
  }

  construct.enableMiddleware = () => {
    if (!paintedWithMiddleware(this)) {
      paintWithMiddleware(this)
      this.applyMiddleware = extendWithMiddleware(construct)
    }
    return construct
  }

  construct.clone = function (cloneProps : ComponentPropType = {}, ...cloneChildren : any[]) : componentCreatorType {
    const { children = [], ...originalProps } = props
    return createComponent(
      constructor,
      { ...originalProps, ...cloneProps },
      ...originalChildrenOrFreshChildren(children, cloneChildren)
    )
  }

  construct.props = Object.freeze(props)

  return paint(construct)
}
