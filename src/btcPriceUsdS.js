const kefir = require('kefir')
const WebSocket = require('ws')

function socketS (market) {
  const socket = new WebSocket(
    'wss://api.gemini.com/v1/marketdata/'+market)
  return kefir.fromEvents(socket, 'message')
}

function btcPriceUsdS () {
  return socketS('btcusd')
    .map(d => d.data)
    .map(JSON.parse)
    .filter(d => d.type === 'update')
    .map(d => d.events)
    .flatten()
    .filter(u => u['reason'] === 'trade')
    .map(u => parseFloat(u['price']))
}

module.exports = btcPriceUsdS
