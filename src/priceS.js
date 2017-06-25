

const kefir = require('kefir')
const polo = require('poloniex-unofficial')


function price (ticker) {
  return parseFloat(ticker.highestBid)
}


function currencyPair (ticker) {
  return ticker.currencyPair
}


function updatePriceMap (map, ticker) {
  const pair = currencyPair(ticker)
  map[pair] = price(ticker)
  return map
}


function tickerS () {
  const poloPush = new polo.PushWrapper()
  return kefir.stream(emitter => {
    poloPush.ticker((err, res) => {
      if (err)
        emitter.emit(err)
      else
        emitter.emit(res)
    })
  })
}


function updatedPriceS (startingPrices) {
  return tickerS()
    .scan(updatePriceMap, startingPrices)
}


function marshall (ticker) {
  const obj = {}
  for (key in ticker) {
    obj[key] = price(ticker[key])
  }
  return obj
}


function startingTickerS () {
  const poloPublic = new polo.PublicWrapper()
  return kefir
    .fromNodeCallback(poloPublic.returnTicker)
    .map(marshall)
}


function priceS () {
  return startingTickerS()
    .flatMap(updatedPriceS)
}


module.exports = priceS
