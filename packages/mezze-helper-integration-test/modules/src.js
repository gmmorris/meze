module.exports = function (Mezze) {
  const propsToPass = {
    A: 'prop',
    B: 'otherProp'
  }

  const functionToExecute = (props) => {
    const { children, A } = props
    return { [A]: children[0] }
  }

  const Comp = Mezze.Component(functionToExecute)
  const singleChild = true

  return <Comp {...propsToPass}>{singleChild}</Comp>
}
