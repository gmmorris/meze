module.exports = function (Meze) {
  const propsToPass = {
    A: 'prop',
    B: 'otherProp'
  }

  const functionToExecute = (props) => {
    const { children, A } = props
    return { [A]: Meze.Children.only(children) }
  }

  const Comp = Meze.Component(functionToExecute)
  const singleChild = true

  return Meze.compose(<Comp {...propsToPass}>{singleChild}</Comp>)
}
