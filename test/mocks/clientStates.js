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
      messages: [
        { pseudo: 'ffff', timestamp: 1503792916, message: 'sup', _id: '858cf07f-660b-4a69-9878-713b2bc04d6a', _rev: '1-b99bd717eb8e4fa685b9ea0210a570cb' },
        { pseudo: 'ffff', timestamp: 1503792918, message: 'hey', _id: 'e086b6a8-b4d9-4669-f09e-fcb65e5d39b4', _rev: '1-1cc2fbb2e9c543d0bd8f871acbdf73d3' },
      ],
      currentUser: null,
    },
  },

  // a 'change' event happens
  {
    happening: function (client, clientAPI) {
      client.store.sync.emit('change', client.mockChange)
    },
    state: {
      errors: [],
      messagesLoading: false,
      connected: true,
      messages: [
        { pseudo: 'ffff', timestamp: 1503792916, message: 'sup', _id: '858cf07f-660b-4a69-9878-713b2bc04d6a', _rev: '1-b99bd717eb8e4fa685b9ea0210a570cb' },
        { pseudo: 'ffff', timestamp: 1503792918, message: 'hey', _id: 'e086b6a8-b4d9-4669-f09e-fcb65e5d39b4', _rev: '1-1cc2fbb2e9c543d0bd8f871acbdf73d3' },
        {pseudo: "ffff", timestamp: 1503793056, message: "what it is", _id: "a504259e-ecfc-483d-fb23-44c71125ded2", _rev: "1-155f315264194403ab360a46ddeb54d7"},
        {pseudo: "ffff", timestamp: 1503793056, message: "hey", _id: "72c5e803-f509-4f39-9b01-dc47cac650d5", _rev: "1-6603e1a0b3474943a8f70e6397824f64"}
      ],
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
