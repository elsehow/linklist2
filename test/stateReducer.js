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
  t.plan(mockClientStates.length)
  let i = 0 // mutable counter
  let store = createStateReducer(mockClient)
  // go through each state in order
  store.subscribe(function (state) {
    t.deepEquals(
      state,
      mockClientStates[i],
    )
    i+=1
  })
  // go through each action in order
  store.dispatch({type:'fetch'})
})

// TODO error state
// TODO change events w different posts result in time sorted list of messages
