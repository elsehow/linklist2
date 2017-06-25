const Poloniex = require('poloniex.js');
const kefir = require('kefir')

// Object -> Object
function valuesToFloat (obj1) {
  // takes an object, values of which are all keys
  // returns an object with the same keys,
  // values of which are all floats
  var obj2 = {}
  for (key in obj1) {
    obj2[key] = parseFloat(obj1[key])
  }
  return obj2
}


function balanceApiS (apiKey, apiSecret) {
  const poloniex = new Poloniex(apiKey, apiSecret)
  return kefir.fromNodeCallback(cb => {
    poloniex.returnBalances(cb)
  }).map(valuesToFloat)
}

module.exports = balanceApiS
