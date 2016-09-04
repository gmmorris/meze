var x = Mezze.createComponent(
  Parent,
  null,
  Mezze.createComponent(
    Child,
    null,
    Mezze.createComponent(Grandchild, null)
  ),
  Mezze.createComponent(
    Component,
    null,
    foo,
    Mezze.createComponent(Grandchild, null),
    bar
  ),
  Mezze.createComponent(Child, null)
);