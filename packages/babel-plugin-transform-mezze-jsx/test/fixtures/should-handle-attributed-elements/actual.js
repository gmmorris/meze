var HelloMessage = Mezze.Component(function (props) {
    return <Composite>Hello {props.name}</Composite>;
  })

Mezze.compose(<HelloMessage name={
  <Span>
    Sebastian
  </Span>
} />);
