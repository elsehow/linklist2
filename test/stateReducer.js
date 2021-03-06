const test = require('tape')
const createStateReducer = require('..').createStateReducer

const mockClient = require('./mocks/client')

const mockClientStates = require('./mocks/clientStates')
let store = null

test('state reducer exists', t => {
  t.ok(createStateReducer)
  t.end()
})

test('create new state reducer', t => {
  store = createStateReducer(mockClient)
  t.deepEquals(
    store.getState(),
    mockClientStates[0].state(),
  )
  t.ok(store)
  t.end()
})

test('create new state reducer', t => {
  let i = 1 // mutable counter
  let lastState = // mutable state reference
      mockClientStates[0].state()
  // start at 1 - we already tested initial state, above
  // go through each state in order
  store.subscribe(function (state) {
    if (i < mockClientStates.length) {
      lastState = mockClientStates[i].state(lastState)
      t.deepEquals(
        state,
        lastState,
        'matches state ' + i
      )
      i+=1
    }
  })
  // method to execute next action
  function next () {
    if (i < mockClientStates.length)
      mockClientStates[i].happening(mockClient, store.clientAPI)
    else {
      clearInterval(interval)
      t.end()
    }
  }
  // on an interval
  var interval = setInterval(next, 1)
})

// TODO error state
// TODO change events w different posts result in time sorted list of messages
