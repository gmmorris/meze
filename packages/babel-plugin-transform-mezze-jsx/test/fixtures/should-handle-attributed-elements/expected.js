var HelloMessage = Mezze.Component(function (props) {
  return Mezze.createComponent(
    Composite,
    null,
    "Hello ",
    props.name
  );
});

Mezze.compose(Mezze.createComponent(HelloMessage, { name: Mezze.createComponent(
    Span,
    null,
    "Sebastian"
  ) }));