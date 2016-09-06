import flattenPromises from './internals/flattenPromises'

export default function compose (component) {
  return flattenPromises(component)
}
