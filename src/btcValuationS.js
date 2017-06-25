const kefir = require('kefir')
const balanceApiS = require('./balanceApiS')
const priceS = require('./priceS')

function btcValuation (balances, prices) {
  var btcV = 0
  for (coin in balances) {
    var b = balances[coin]
    if (b > 0) {
      if (coin == 'BTC')
        btcV += b
      else {
        var btcMarket = 'BTC_'+coin
        var price = prices[btcMarket]
        var valuation = b*price
        btcV += valuation
      }
    }
  }
  return btcV
}

function btcValuationS (apiKey, apiSecret) {
  let streams = [
    balanceApiS(apiKey, apiSecret),
    priceS(),
  ]
  return kefir.combine(streams, btcValuation)
    .skipDuplicates()
}

module.exports = btcValuationS
