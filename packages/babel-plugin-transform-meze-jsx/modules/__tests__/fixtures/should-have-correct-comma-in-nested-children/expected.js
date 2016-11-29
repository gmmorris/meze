var x = Meze.createComponent(
  Parent,
  null,
  Meze.createComponent(
    Child,
    null,
    Meze.createComponent(Grandchild, null)
  ),
  Meze.createComponent(
    Component,
    null,
    foo,
    Meze.createComponent(Grandchild, null),
    bar
  ),
  Meze.createComponent(Child, null)
);