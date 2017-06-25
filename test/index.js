const fundEstimateS = require('..')
const test = require('tape')

test('offers BTC and USD estimates', t => {
  const keys = require('../poloniex-keys.json')
  const estS = fundEstimateS(
    keys['pk'],
    keys['sk']
  )
  function check (est) {
    t.ok(est.btcValue)
    t.deepEqual(typeof(est.btcValue), 'number')
    t.ok(est.usdValue)
    t.deepEqual(typeof(est.usdValue), 'number')
    t.end()
    estS.offValue(check)
    estS.offError(err)
  }
  function err (error) {
    t.notOk(err)
  }
  estS.onValue(check)
  estS.onError(err)
})

