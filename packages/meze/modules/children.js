
export const map = (children, mapper) =>
  children.map(child => mapper(child))

export default {
  map
}
