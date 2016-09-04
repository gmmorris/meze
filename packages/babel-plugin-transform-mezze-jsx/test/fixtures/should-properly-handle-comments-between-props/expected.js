var x = Mezze.createComponent(
  Master
  /* a multi-line
     comment */
  ,
  { attr1: "foo" },
  Mezze.createComponent(Slave // a double-slash comment
  , { attr2: "bar"
  })
);