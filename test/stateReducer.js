const test = require('tape')
const createStateReducer = require('..').createStateReducer

test('state reducer exists', t => {
  t.ok(createStateReducer)
  t.end()
})
