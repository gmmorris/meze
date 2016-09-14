/* @flow */

type Paintable = Object | Function

const isValidForPainting = (obj : Paintable) : boolean =>
  obj && (typeof obj === 'object' || typeof obj === 'function')

const paint = symbol => (obj : Paintable, val : any = true) : Paintable => {
  // console.log(`paint:`)
  // console.log(symbol)
  if (isValidForPainting(obj)) {
    obj[symbol] = val
  }
  return obj
}

const painted = symbol => (obj : Paintable) : boolean => {
  // console.log(`painted:`)
  // console.log(symbol)
  if (isValidForPainting(obj)) {
    return obj[symbol] !== undefined
  }
  return false
}

const paintedBy = symbol => (obj : Paintable) : any => {
  // console.log(`paintedBy:`)
  // console.log(symbol)
  if (isValidForPainting(obj)) {
    return obj[symbol]
  }
}

const clean = symbol => (obj : Paintable) : Paintable => {
  if (obj && obj[symbol]) {
    delete obj[symbol]
  }
  return obj
}

type SymbolPainter = {
  paint : (obj : Paintable) => Paintable,
  painted : (obj : Paintable) => boolean,
  paintedBy : (obj : Paintable) => any,
  clean : (obj : Paintable) => Paintable
}

export default function (symbolName : string) : SymbolPainter {
  const paintSymbol = Symbol(symbolName)
  // console.log(paintSymbol)
  return {
    paint: paint(paintSymbol),
    painted: painted(paintSymbol),
    paintedBy: paintedBy(paintSymbol),
    clean: clean(paintSymbol)
  }
}
