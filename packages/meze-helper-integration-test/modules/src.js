module.exports = function (Meze) {
  const propsToPass = {
    A: 'prop',
    B: 'otherProp'
  }

  const functionToExecute = (props) => {
    const { children, A } = props
    return { [A]: children[0] }
  }

  const Comp = Meze.Component(functionToExecute)
  const singleChild = true

  return Meze.compose(<Comp {...propsToPass}>{singleChild}</Comp>)
}
