var x = Meze.createComponent(
  Master
  /* a multi-line
     comment */
  ,
  { attr1: "foo" },
  Meze.createComponent(Slave // a double-slash comment
  , { attr2: "bar"
  })
);