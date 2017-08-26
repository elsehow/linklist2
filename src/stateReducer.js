const createStore = require('minidux').createStore

const initialState = {
  messages: []
}

function reducer (state=initialState, action) {
  switch (action.type) {
  case 'fetch':
    return state
  }
}

function createStateReducer (client) {

  // client
  //   .allDocs()
    // .then()
    // .catch()

  const store = createStore(reducer, initialState)
  return store

}

module.exports = createStateReducer


// client.'connect'
// client.'disconnect'
// client.store.sync.'change'
// client.store.sync.'error'
// client.store.sync.'paused'
// client.store.sync.'active'
