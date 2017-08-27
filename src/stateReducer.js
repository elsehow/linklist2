const createStore = require('minidux').createStore
const sortBy = require('lodash.sortby')

const initialState = {
  errors: [],
  connected: false,
  messages: [],
  messagesLoading: false,
  currentUser: null,
}

function sort (docs) {
  return sortBy(docs, 'timestamp')
}

function docs (rows) {
  return rows.map(r => {
    return r.doc
  })
}

function reducer (state=initialState, action) {
  switch (action.type) {
  case 'connect':
    state.connected = true
    return state
  case 'disconnect':
    state.connected = false
    return state
  case 'attempt-join':
    state.currentUser = action.currentUser
    state.messagesLoading = true
    return state
  case 'error':
    console.log('receiving error')
    state.errors.push(action.error)
    state.currentUser = null
    state.messagesLoading = false
    return state
  case 'clear-errors':
    state.errors = []
    return state
  case 'all-messages':
    console.log('reached all messages', action)
    state.messages = sort(docs(action.all.rows))
    return state
  case 'change':
    console.log('reached change')
    state.messages =
      sort(state.messages.concat(action.change.docs))
    return state
  default:
    return state
  }
}

function createStateReducer (client) {

  // create store
  const store = createStore(reducer, initialState)

  // wire up client events
  client.on('ready', () => store.dispatch({ type: 'fetch-state' }))
  client.on('connect', () => store.dispatch({ type: 'connect' }))
  client.on('disconnect', () => store.dispatch({ type: 'disconnect' }))
  client.on('error', err => store.dispatch({ type: 'error', error: err }))
  // wire up sync events
  client.store.sync.on('all-messages', all => store.dispatch({
    type: 'all-messages',
    all: all,
  }))
  client.store.sync.on('change', change=> store.dispatch({
    type: 'change',
    change: change,
  }))

  // construct client API
  store.clientAPI = {

    join: function (pseudo, color) {
      client.join(pseudo, color)
      store.dispatch({
        type: 'attempt-join',
        currentUser: {
          pseudo: pseudo,
          color: color,
      }})
    },

    clearErrors: function () {
      store.dispatch({
        type: 'clear-errors',
      })
    },
  }

  // return store
  return store
}

module.exports = createStateReducer

// client.store.sync.'change'
// client.store.sync.'error'
// client.store.sync.'paused'
// client.store.sync.'active'
