module.exports = [

  // initial state
  {
    happening: function (client) {
      console.log('waiting for cb')
      // client.emit('ready')
    },
    state: {
      errors: [],
      online: {},
      connected: false,
      messagesLoading: false,
      messageInput: '',
      sendingMessageInput: false,
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
      online: {},
      connected: true,
      messageInput: '',
      sendingMessageInput: false,
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
      online: {},
      messageInput: '',
      sendingMessageInput: false,
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
      online: {},
      connected: true,
      messageInput: '',
      sendingMessageInput: false,
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
      online: {},
      connected: true,
      messageInput: '',
      sendingMessageInput: false,
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
      // console.log('waiting for callback...')
    },
    state: {
      errors: [
        'Fake error',
      ],
      online: {},
      connected: true,
      messageInput: '',
      sendingMessageInput: false,
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
      online: {},
      errors: [],
      messagesLoading: false,
      messageInput: '',
      sendingMessageInput: false,
      connected: true,
      messages: [],
      currentUser: null,
    },
  },

  // join again
  {
    happening: function (client, clientAPI) {
      clientAPI.join('ffff', '#fff')
    },
    state: {
      errors: [],
      online: {},
      messageInput: '',
      sendingMessageInput: false,
      messagesLoading: true,
      connected: true,
      messages: [
      ],
      currentUser: {
        pseudo: 'ffff',
        color: '#fff',
      },
    },
  },
  // room joined, just loaded messages
  {
    happening: function (client, clientAPI) {
      client.store.fetchAllMessages()
    },
    state: {
      errors: [],
      online: {},
      messagesLoading: false,
      messageInput: '',
      sendingMessageInput: false,
      connected: true,
      messages: [
        { pseudo: 'ffff', timestamp: 1503792916, message: 'sup', _id: '858cf07f-660b-4a69-9878-713b2bc04d6a', _rev: '1-b99bd717eb8e4fa685b9ea0210a570cb' },
        { pseudo: 'ffff', timestamp: 1503792918, message: 'hey', _id: 'e086b6a8-b4d9-4669-f09e-fcb65e5d39b4', _rev: '1-1cc2fbb2e9c543d0bd8f871acbdf73d3' },
      ],
      currentUser: {
        pseudo: 'ffff',
        color: '#fff',
      },
    },
  },

  // a 'change' event happens, messages are merged
  {
    happening: function (client, clientAPI) {
      client.store.sync.emit('change', client.mockChange)
    },
    state: {
      errors: [],
      online: {},
      messageInput: '',
      sendingMessageInput: false,
      messagesLoading: false,
      connected: true,
      currentUser: {
        pseudo: 'ffff',
        color: '#fff',
      },
      messages: [
        { pseudo: 'ffff', timestamp: 1503792916,
          message: 'sup', _id: '858cf07f-660b-4a69-9878-713b2bc04d6a',
          _rev: '1-b99bd717eb8e4fa685b9ea0210a570cb' },
        { pseudo: 'ffff', timestamp: 1503792918,
          message: 'hey', _id: 'e086b6a8-b4d9-4669-f09e-fcb65e5d39b4',
          _rev: '1-1cc2fbb2e9c543d0bd8f871acbdf73d3' },
        {pseudo: "ffff", timestamp: 1503793056,
         message: "hey", _id: "72c5e803-f509-4f39-9b01-dc47cac650d5",
         _rev: "1-6603e1a0b3474943a8f70e6397824f64"},
        {pseudo: "ffff", timestamp: 1503793059,
         message: "what it is", _id: "a504259e-ecfc-483d-fb23-44c71125ded2",
         _rev: "1-155f315264194403ab360a46ddeb54d7"},
      ],
    },
  },

  // new online object from server
  {
    happening: function (client, clientAPI) {
      client.emit('online',
                  {
                    'ffff': '#fff',
                    'aaaa': '#a0a0a',
                  }
                 )
    },
    state: {
      errors: [],
      online: {
        'ffff': '#fff',
        'aaaa': '#a0a0a',
      },
      messagesLoading: false,
      messageInput: '',
      sendingMessageInput: false,
      connected: true,
      currentUser: {
        pseudo: 'ffff',
        color: '#fff',
      },
      messages: [
        { pseudo: 'ffff', timestamp: 1503792916,
          message: 'sup', _id: '858cf07f-660b-4a69-9878-713b2bc04d6a',
          _rev: '1-b99bd717eb8e4fa685b9ea0210a570cb' },
        { pseudo: 'ffff', timestamp: 1503792918,
          message: 'hey', _id: 'e086b6a8-b4d9-4669-f09e-fcb65e5d39b4',
          _rev: '1-1cc2fbb2e9c543d0bd8f871acbdf73d3' },
        {pseudo: "ffff", timestamp: 1503793056,
         message: "hey", _id: "72c5e803-f509-4f39-9b01-dc47cac650d5",
         _rev: "1-6603e1a0b3474943a8f70e6397824f64"},
        {pseudo: "ffff", timestamp: 1503793059,
         message: "what it is", _id: "a504259e-ecfc-483d-fb23-44c71125ded2",
         _rev: "1-155f315264194403ab360a46ddeb54d7"},
      ],
    },
  },

  // enter a message
  {
    happening: function (client, clientAPI) {
      clientAPI.setMessageInput('hey everyone')
    },
    state: {
      errors: [],
      online: {
        'ffff': '#fff',
        'aaaa': '#a0a0a',
      },
      messagesLoading: false,
      messageInput: 'hey everyone',
      sendingMessageInput: false,
      connected: true,
      currentUser: {
        pseudo: 'ffff',
        color: '#fff',
      },
      messages: [
        { pseudo: 'ffff', timestamp: 1503792916,
          message: 'sup', _id: '858cf07f-660b-4a69-9878-713b2bc04d6a',
          _rev: '1-b99bd717eb8e4fa685b9ea0210a570cb' },
        { pseudo: 'ffff', timestamp: 1503792918,
          message: 'hey', _id: 'e086b6a8-b4d9-4669-f09e-fcb65e5d39b4',
          _rev: '1-1cc2fbb2e9c543d0bd8f871acbdf73d3' },
        {pseudo: "ffff", timestamp: 1503793056,
         message: "hey", _id: "72c5e803-f509-4f39-9b01-dc47cac650d5",
         _rev: "1-6603e1a0b3474943a8f70e6397824f64"},
        {pseudo: "ffff", timestamp: 1503793059,
         message: "what it is", _id: "a504259e-ecfc-483d-fb23-44c71125ded2",
         _rev: "1-155f315264194403ab360a46ddeb54d7"},
      ],
    },
  },

  // send the message
  {
    happening: function (client, clientAPI) {
      clientAPI.sendMessageInput()
    },
    state: {
      errors: [],
      online: {
        'ffff': '#fff',
        'aaaa': '#a0a0a',
      },
      messagesLoading: false,
      messageInput: 'hey everyone',
      // now we are 'sending' (send is pending)
      sendingMessageInput: true,
      connected: true,
      currentUser: {
        pseudo: 'ffff',
        color: '#fff',
      },
      messages: [
        { pseudo: 'ffff', timestamp: 1503792916,
          message: 'sup', _id: '858cf07f-660b-4a69-9878-713b2bc04d6a',
          _rev: '1-b99bd717eb8e4fa685b9ea0210a570cb' },
        { pseudo: 'ffff', timestamp: 1503792918,
          message: 'hey', _id: 'e086b6a8-b4d9-4669-f09e-fcb65e5d39b4',
          _rev: '1-1cc2fbb2e9c543d0bd8f871acbdf73d3' },
        {pseudo: "ffff", timestamp: 1503793056,
         message: "hey", _id: "72c5e803-f509-4f39-9b01-dc47cac650d5",
         _rev: "1-6603e1a0b3474943a8f70e6397824f64"},
        {pseudo: "ffff", timestamp: 1503793059,
         message: "what it is", _id: "a504259e-ecfc-483d-fb23-44c71125ded2",
         _rev: "1-155f315264194403ab360a46ddeb54d7"},
      ],
    },
  },

  // server error! message still in box
  {
    happening: function (client, clientAPI) {
      // console.log('waiting for cb...')
    },
    state: {
      errors: [
        'Fake error'
      ],
      online: {
        'ffff': '#fff',
        'aaaa': '#a0a0a',
      },
      messagesLoading: false,
      messageInput: 'hey everyone',
      // now we are 'sending' (send is pending)
      sendingMessageInput: false,
      connected: true,
      currentUser: {
        pseudo: 'ffff',
        color: '#fff',
      },
      messages: [
        { pseudo: 'ffff', timestamp: 1503792916,
          message: 'sup', _id: '858cf07f-660b-4a69-9878-713b2bc04d6a',
          _rev: '1-b99bd717eb8e4fa685b9ea0210a570cb' },
        { pseudo: 'ffff', timestamp: 1503792918,
          message: 'hey', _id: 'e086b6a8-b4d9-4669-f09e-fcb65e5d39b4',
          _rev: '1-1cc2fbb2e9c543d0bd8f871acbdf73d3' },
        {pseudo: "ffff", timestamp: 1503793056,
         message: "hey", _id: "72c5e803-f509-4f39-9b01-dc47cac650d5",
         _rev: "1-6603e1a0b3474943a8f70e6397824f64"},
        {pseudo: "ffff", timestamp: 1503793059,
         message: "what it is", _id: "a504259e-ecfc-483d-fb23-44c71125ded2",
         _rev: "1-155f315264194403ab360a46ddeb54d7"},
      ],
    },
  },

  // send message, it's pending, message still in box
  {
    happening: function (client, clientAPI) {
      clientAPI.sendMessageInput()
    },
    state: {
      errors: [
        'Fake error'
      ],
      online: {
        'ffff': '#fff',
        'aaaa': '#a0a0a',
      },
      messagesLoading: false,
      messageInput: 'hey everyone',
      // now we are 'sending' (send is pending)
      sendingMessageInput: true,
      connected: true,
      currentUser: {
        pseudo: 'ffff',
        color: '#fff',
      },
      messages: [
        { pseudo: 'ffff', timestamp: 1503792916,
          message: 'sup', _id: '858cf07f-660b-4a69-9878-713b2bc04d6a',
          _rev: '1-b99bd717eb8e4fa685b9ea0210a570cb' },
        { pseudo: 'ffff', timestamp: 1503792918,
          message: 'hey', _id: 'e086b6a8-b4d9-4669-f09e-fcb65e5d39b4',
          _rev: '1-1cc2fbb2e9c543d0bd8f871acbdf73d3' },
        {pseudo: "ffff", timestamp: 1503793056,
         message: "hey", _id: "72c5e803-f509-4f39-9b01-dc47cac650d5",
         _rev: "1-6603e1a0b3474943a8f70e6397824f64"},
        {pseudo: "ffff", timestamp: 1503793059,
         message: "what it is", _id: "a504259e-ecfc-483d-fb23-44c71125ded2",
         _rev: "1-155f315264194403ab360a46ddeb54d7"},
      ],
    },
  },

  // now it's sent, disappears from box
  {
    happening: function (client, clientAPI) {
      // console.log('waiting for cb again')
    },
    state: {
      errors: [
        'Fake error'
      ],
      online: {
        'ffff': '#fff',
        'aaaa': '#a0a0a',
      },
      messagesLoading: false,
      messageInput: '',
      // now we are 'sending' (send is pending)
      sendingMessageInput: false,
      connected: true,
      currentUser: {
        pseudo: 'ffff',
        color: '#fff',
      },
      messages: [
        { pseudo: 'ffff', timestamp: 1503792916,
          message: 'sup', _id: '858cf07f-660b-4a69-9878-713b2bc04d6a',
          _rev: '1-b99bd717eb8e4fa685b9ea0210a570cb' },
        { pseudo: 'ffff', timestamp: 1503792918,
          message: 'hey', _id: 'e086b6a8-b4d9-4669-f09e-fcb65e5d39b4',
          _rev: '1-1cc2fbb2e9c543d0bd8f871acbdf73d3' },
        {pseudo: "ffff", timestamp: 1503793056,
         message: "hey", _id: "72c5e803-f509-4f39-9b01-dc47cac650d5",
         _rev: "1-6603e1a0b3474943a8f70e6397824f64"},
        {pseudo: "ffff", timestamp: 1503793059,
         message: "what it is", _id: "a504259e-ecfc-483d-fb23-44c71125ded2",
         _rev: "1-155f315264194403ab360a46ddeb54d7"},
      ],
    },
  },

  // leave room, no messages, just who is online
  // now it's sent, disappears from box
  {
    happening: function (client, clientAPI) {
      clientAPI.leave()
    },
    state: {
      errors: [
        'Fake error'
      ],
      online: {
        'ffff': '#fff',
        'aaaa': '#a0a0a',
      },
      messagesLoading: false,
      messageInput: '',
      // now we are 'sending' (send is pending)
      sendingMessageInput: false,
      connected: true,
      currentUser: null,
      messages: [
      ],
    },
  },

  // a 'change' event won't show up if we have not 'joined'
  {
    happening: function (client, clientAPI) {
      client.store.sync.emit('change', client.mockChange)
    },
    state: {
      errors: [
        'Fake error'
      ],
      online: {
        'ffff': '#fff',
        'aaaa': '#a0a0a',
      },
      messagesLoading: false,
      messageInput: '',
      // now we are 'sending' (send is pending)
      sendingMessageInput: false,
      connected: true,
      currentUser: null,
      messages: [
      ],
    },
  },
]
