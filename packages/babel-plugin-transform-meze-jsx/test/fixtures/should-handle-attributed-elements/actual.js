var HelloMessage = Meze.Component(function (props) {
    return <Composite>Hello {props.name}</Composite>;
  })

Meze.compose(<HelloMessage name={
  <Span>
    Sebastian
  </Span>
} />);
