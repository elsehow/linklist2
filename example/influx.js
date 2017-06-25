const truthy = x => !!x
const kefir = require('kefir')
const Influx = require('influx');
const dbname = 'fundvalue'
const influx = new Influx.InfluxDB({
  host: 'localhost',
  database: dbname,
})

function valueMeasurement (values) {
  return {
    'measurement': 'value',
    'fields': values
  }
}

function writeS (measurements) {
  return kefir.fromPromise(
    influx.writePoints(measurements)
  )
}

const fundEstimateS = require('..')
const keys = require('../poloniex-keys.json')
const estS = fundEstimateS(
  keys['pk'],
  keys['sk']
)

kefir.fromPromise(
  influx.createDatabase(dbname)
).flatMap(() => {
  return estS
    .map(valueMeasurement)
    .log('measurement')
    .bufferWithTimeOrCount(500, 100)
    .flatMap(writeS)
})
  .onError(err => console.log('ERR!', err))
