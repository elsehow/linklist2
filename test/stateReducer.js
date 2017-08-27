const test = require('tape')
const createStateReducer = require('..').createStateReducer

const mockClient = require('./mocks/client')

const mockClientStates = require('./mocks/clientStates')

test('state reducer exists', t => {
  t.ok(createStateReducer)
  t.end()
})

test('create new state reducer', t => {
  let store = createStateReducer(mockClient)
  t.ok(store)
  t.end()
})

test('create new state reducer', t => {
  let i = 0 // mutable counter
  let store = createStateReducer(mockClient)
  // go through each state in order
  store.subscribe(function (state) {
    t.deepEquals(
      state,
      mockClientStates[i].state,
    )
    i+=1
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
  var interval = setInterval(next, 10)
})

// TODO error state
// TODO change events w different posts result in time sorted list of messages
