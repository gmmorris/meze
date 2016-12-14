import isIterable from './isIterable'

export default function (children : Iterable<any> = []) : any[] {
  return Array.isArray(children)
    ? children
    : isIterable(children)
      ? Array.from(children)
      : []
}
