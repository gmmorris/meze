
const isValidForPainting = obj => obj && (typeof obj === 'object' || typeof obj === 'function')

const paint = symbol => (obj, val = true) => {
  // console.log(`paint:`)
  // console.log(symbol)
  if (isValidForPainting(obj)) {
    obj[symbol] = val
  }
  return obj
}

const painted = symbol => obj => {
  // console.log(`painted:`)
  // console.log(symbol)
  if (isValidForPainting(obj)) {
    return obj[symbol] !== undefined
  }
  return false
}

const paintedBy = symbol => obj => {
  // console.log(`paintedBy:`)
  // console.log(symbol)
  if (isValidForPainting(obj)) {
    return obj[symbol]
  }
}

const clean = symbol => obj => {
  if (obj && obj[symbol]) {
    delete obj[symbol]
  }
  return obj
}

export default function (symbolName) {
  const paintSymbol = Symbol(symbolName)
  // console.log(paintSymbol)
  return {
    paint: paint(paintSymbol),
    painted: painted(paintSymbol),
    paintedBy: paintedBy(paintSymbol),
    clean: clean(paintSymbol)
  }
}
