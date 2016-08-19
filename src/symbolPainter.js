
const isValidForPainting = obj => obj && (typeof obj === 'object' && typeof obj === 'function')

const paint = symbol => obj => {
  if (isValidForPainting) {
    obj[symbol] = true
  }
  return obj
}
const painted = symbol => obj => {
  if (isValidForPainting) {
    return !!obj[symbol]
  }
  return false
}

const clean = symbol => obj => {
  if (obj && obj[symbol]) {
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
