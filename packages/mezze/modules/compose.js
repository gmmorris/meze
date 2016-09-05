import flattenPromises from './FlattenPromises'

export default function compose (component) {
  return flattenPromises(component)
}
