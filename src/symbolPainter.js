import isPlainObject from 'lodash.isplainobject'

const paint = symbol => obj => {
  if (isPlainObject(obj)) {
    obj[symbol] = true
  }
  return obj
}
const painted = symbol => obj => {
  if (isPlainObject(obj)) {
    return !!obj[symbol]
  }
  return false
}

const clean = symbol => obj => {
  if (isPlainObject(obj) && obj[symbol]) {
    delete obj[symbol]
  }
  return obj
}

export default function (symbolName) {
  const paintSymbol = Symbol(symbolName)
  return {
    paint: paint(paintSymbol),
    painted: painted(paintSymbol),
    clean: clean(paintSymbol)
  }
}
