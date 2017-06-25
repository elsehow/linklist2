const kefir = require('kefir')
const btcPriceUsdS = require('./btcPriceUsdS')
const btcValuationS = require('./btcValuationS')

function estimate (btcValue, btcPrice) {
  return {
    'btcValue': btcValue,
    'usdValue': btcValue * btcPrice,
  }
}

function fundEstimateS (apiKey, apiSecret) {
  return kefir.combine([
    btcValuationS(apiKey, apiSecret),
    btcPriceUsdS()
  ], estimate)
}

module.exports = fundEstimateS
