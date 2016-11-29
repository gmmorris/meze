var HelloMessage = Meze.Component(function (props) {
  return Meze.createComponent(
    Composite,
    null,
    "Hello ",
    props.name
  );
});

Meze.compose(Meze.createComponent(HelloMessage, { name: Meze.createComponent(
    Span,
    null,
    "Sebastian"
  ) }));