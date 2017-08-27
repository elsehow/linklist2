module.exports = [

  // initial state
  {
    happening: function (client) {
      client.emit('ready')
    },
    state: {
      errors: [],
      connected: false,
      messagesLoading: false,
      messages: [],
      currentUser: null,
    },
  },

  // connect to server
  {
    happening: function (client) {
      client.emit('connect')
    },
    state: {
      errors: [],
      connected: true,
      messagesLoading: false,
      messages: [],
      currentUser: null,
    },
  },

  // oops, disconnected
  {
    happening: function (client) {
      client.emit('disconnect')
    },
    state: {
      errors: [],
      connected: false,
      messages: [],
      messagesLoading: false,
      currentUser: null,
    },
  },

  // reconnect
  {
    happening: function (client) {
      client.emit('connect')
    },
    state: {
      errors: [],
      connected: true,
      messagesLoading: false,
      messages: [],
      currentUser: null,
    },
  },


  // try to join a room
  {
    happening: function (client, clientAPI) {
      clientAPI.join('ffff', '#fff')
    },
    state: {
      errors: [],
      connected: true,
      messagesLoading: true,
      messages: [],
      currentUser: {
        pseudo: 'ffff',
        color: '#fff',
      },
    },
  },

  // ERROR! Bad username
  {
    happening: function (client, clientAPI) {
      console.log('emitting error')
      client.emit('error', 'already taken')
    },
    state: {
      errors: [
        'already taken',
      ],
      connected: true,
      messagesLoading: false,
      messages: [],
      currentUser: null,
    },
  },

  // clear errors
  {
    happening: function (client, clientAPI) {
      clientAPI.clearErrors()
    },
    state: {
      errors: [],
      messagesLoading: false,
      connected: true,
      messages: [],
      currentUser: null,
    },
  },

  // room joined, just loaded messages
  {
    happening: function (client, clientAPI) {
      client.store.fetchAllMessages()
    },
    state: {
      errors: [],
      messagesLoading: false,
      connected: true,
      messages: [],
      currentUser: null,
    },
  },

  // receive messages
  // { },

  // server error! message still in box?

  // now sync has error

  // now db sync has error

  // enter a message

  // send message, it's pending, message still in box

  // now it's sent, disappears from box

  // batch of messages over 'changes' feed

  // leave room, back to initial state
]
