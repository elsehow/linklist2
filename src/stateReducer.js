const createStore = require('minidux').createStore
const sortBy = require('lodash.sortby')

const initialState = {
  online: {},
  errors: [],
  pseudoInput: '',
  joining: false,
  colorChoice: null,
  messageInput: '',
  sendingMessageInput: false,
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
    state.joining = true
    return state
  case 'attempt-join-success':
    state.joining = false
    state.currentUser = action.currentUser
    state.messagesLoading = true
    return state
  case 'attempt-join-failed':
    state.joining = false
    state.errors.push(action.error)
    return state
  case 'error':
    state.errors.push(action.error)
    return state
  case 'clear-errors':
    state.errors = []
    return state
  case 'all-messages':
    state.messagesLoading = false
    state.messages = sort(docs(action.all.rows))
    return state
  case 'change':
    if (state.currentUser)
      state.messages = sort(state.messages.concat(action.change.docs))
    return state
  case 'online':
    state.online = action.online
    return state
  case 'set-message-input':
    state.messageInput = action.text
    return state
  case 'send-message-input':
    state.sendingMessageInput = true
    return state
  case 'message-input-sent':
    state.sendingMessageInput = false
    state.messageInput = ''
    return state
  case 'send-message-input-failed':
    state.sendingMessageInput = false
    state.errors.push(action.error)
    return state
  case 'left-room':
    state.messages = []
    state.currentUser = null
    return state
  case 'set-pseudo-input':
    console.log('setting pseudo input', action)
    state.pseudoInput = action.text
    return state
  case 'set-color-choice':
    console.log('setting color choice', action)
    state.colorChoice = action.color
    return state
  default:
    return state
  }
}

function createStateReducer (client) {

  // create store
  const store = createStore(reducer, initialState)

  function dispatchErr (err) {
    store.dispatch({
      type: 'error',
      error: err,
    })
  }

  // wire up client events
  client.on('ready', () => store.dispatch({ type: 'fetch-state' }))
  client.on('connect', () => store.dispatch({ type: 'connect' }))
  client.on('disconnect', () => store.dispatch({ type: 'disconnect' }))
  client.on('error', dispatchErr)
  client.on('online', online => store.dispatch({ type: 'online', online: online }))

  // wire up sync events
  client.store.sync.on('all-messages', all => {
    store.dispatch({
      type: 'all-messages',
      all: all,
    })
  })
  client.store.sync.on('change', change => {
    store.dispatch({
      type: 'change',
      change: change,
    })
  })

  // other error events TODO test these with mock
  client.store.sync.on('error', dispatchErr)
  client.store.db.on('error', dispatchErr)

  // construct client API
  store.clientAPI = {

    join: function () {
      let state = store.getState()
      let color = state.colorChoice
      let pseudo = state.pseudoInput
      // TODO Handle callback
      client.join(pseudo, color, function (res) {
        if (res)
          store.dispatch({
            type: 'attempt-join-failed',
            error: res,
          })
        else
          store.dispatch({
            type: 'attempt-join-success',
            currentUser: {
              pseudo: pseudo,
              color: color,
            }
          })
      })
      store.dispatch({
        type: 'attempt-join',
      })
    },

    leave: function () {
      client.leave(function (res) {
        if (!res)
          store.dispatch({
            type: 'left-room'
          })
      })
    },

    setMessageInput: function (event) {
      let text = event.target.value
      console.log('setting to', text)
      store.dispatch({
        type: 'set-message-input',
        text: text,
      })
    },

    sendMessageInput: function () {
      let msg = store.getState().messageInput
      console.log('sending', msg)
      client.post(msg, function (res) {
        if (!res)
          store.dispatch({
            type: 'message-input-sent'
          })
        else
          store.dispatch({
            type: 'send-message-input-failed',
            error: res,
          })
      })
      store.dispatch({
        type: 'send-message-input'
      })
    },

    clearErrors: function () {
      store.dispatch({
        type: 'clear-errors',
      })
    },

    setPseudoInput: function (ev) {
      let text = event.target.value
      store.dispatch({
        type: 'set-pseudo-input',
        text: text,
      })
    },

    setColorChoice: function (color) {
      store.dispatch({
        type: 'set-color-choice',
        color: color,
      })
    },
  }

  // return store
  return store
}

module.exports = createStateReducer

// client.store.sync.'paused'
// client.store.sync.'active'
