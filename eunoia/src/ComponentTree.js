import flattenPromises from './FlattenPromises'

export function composeTree (component) {
  return flattenPromises(component)
}
