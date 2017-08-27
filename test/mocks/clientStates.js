module.exports = [

  // initial state
  {
    happening: function (client) {
      console.log('waiting for cb')
      // client.emit('ready')
    },
    state: {
      pseudoInput: '',
      joining: false,
      colorChoice: null,
      leavingRoom: false,
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
      pseudoInput: '',
      joining: false,
      colorChoice: null,
      leavingRoom: false,
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
      pseudoInput: '',
      joining: false,
      colorChoice: null,
      leavingRoom: false,
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
      pseudoInput: '',
      joining: false,
      colorChoice: null,
      leavingRoom: false,
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
      clientAPI.join('ffff', '#a0a')
    },
    state: {
      pseudoInput: '',
      joining: true,
      colorChoice: null,
      leavingRoom: false,
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

  // ERROR! Bad username
  {
    happening: function (client, clientAPI) {
      // console.log('waiting for callback...')
    },
    state: {
      errors: [
        'Fake error',
      ],
      pseudoInput: '',
      joining: false,
      colorChoice: null,
      leavingRoom: false,
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
      pseudoInput: '',
      joining: false,
      colorChoice: null,
      leavingRoom: false,
      messagesLoading: false,
      messageInput: '',
      sendingMessageInput: false,
      connected: true,
      messages: [],
      currentUser: null,
    },
  },

  // set pseudo input
  {
    happening: function (client, clientAPI) {
      clientAPI.setPseudoInput(
        {target: { value: 'ffff' }})
    },
    state: {
      online: {},
      errors: [],
      pseudoInput: 'ffff',
      joining: false,
      colorChoice: null,
      leavingRoom: false,
      messagesLoading: false,
      messageInput: '',
      sendingMessageInput: false,
      connected: true,
      messages: [],
      currentUser: null,
    },
  },

  // set color choice
  {
    happening: function (client, clientAPI) {
      clientAPI.setColorChoice('#a0a')
    },
    state: {
      online: {},
      errors: [],
      pseudoInput: 'ffff',
      joining: false,
      colorChoice: '#a0a',
      leavingRoom: false,
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
      clientAPI.join()
    },
    state: {
      errors: [],
      online: {},
      pseudoInput: 'ffff',
      joining: true,
      colorChoice: '#a0a',
      leavingRoom: false,
      messageInput: '',
      sendingMessageInput: false,
      messagesLoading: false,
      connected: true,
      messages: [],
      currentUser: null,
    },
  },

  // join complete
  {
    happening: function (client, clientAPI) {
      // console.log('waiting for cb')
    },
    state: {
      errors: [],
      online: {},
      pseudoInput: '',
      joining: false,
      colorChoice: null,
      leavingRoom: false,
      messageInput: '',
      sendingMessageInput: false,
      messagesLoading: true,
      connected: true,
      messages: [],
      currentUser: {
        pseudo: 'ffff',
        color: '#a0a',
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
      pseudoInput: '',
      joining: false,
      colorChoice: null,
      leavingRoom: false,
      messagesLoading: false,
      messageInput: '',
      sendingMessageInput: false,
      connected: true,
      messages: [
        { pseudo: 'ffff', timestamp: 1503792916,
          senderColor: '#a0a',
          message: 'sup', _id: '858cf07f-660b-4a69-9878-713b2bc04d6a', _rev: '1-b99bd717eb8e4fa685b9ea0210a570cb' },
        { pseudo: 'ffff', timestamp: 1503792918,
          senderColor: '#a0a',
          message: 'hey', _id: 'e086b6a8-b4d9-4669-f09e-fcb65e5d39b4', _rev: '1-1cc2fbb2e9c543d0bd8f871acbdf73d3' },
      ],
      currentUser: {
        pseudo: 'ffff',
        color: '#a0a',
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
      pseudoInput: '',
      joining: false,
      colorChoice: null,
      leavingRoom: false,
      messageInput: '',
      sendingMessageInput: false,
      messagesLoading: false,
      connected: true,
      currentUser: {
        pseudo: 'ffff',
        color: '#a0a',
      },
      messages: [
        { pseudo: 'ffff', timestamp: 1503792916,
          senderColor: '#a0a',
          message: 'sup', _id: '858cf07f-660b-4a69-9878-713b2bc04d6a',
          _rev: '1-b99bd717eb8e4fa685b9ea0210a570cb' },
        { pseudo: 'ffff', timestamp: 1503792918,
          senderColor: '#a0a',
          message: 'hey', _id: 'e086b6a8-b4d9-4669-f09e-fcb65e5d39b4',
          _rev: '1-1cc2fbb2e9c543d0bd8f871acbdf73d3' },
        {pseudo: "aaaa", timestamp: 1503793056,
         senderColor: '#00a',
         message: "hey", _id: "72c5e803-f509-4f39-9b01-dc47cac650d5",
         _rev: "1-6603e1a0b3474943a8f70e6397824f64"},
        {pseudo: "aaaa", timestamp: 1503793059,
         senderColor: '#00a',
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
                    'ffff': '#a0a',
                    'aaaa': '#00a',
                  }
                 )
    },
    state: {
      errors: [],
      online: {
        'ffff': '#a0a',
        'aaaa': '#00a',
      },
      pseudoInput: '',
      joining: false,
      colorChoice: null,
      leavingRoom: false,
      messagesLoading: false,
      messageInput: '',
      sendingMessageInput: false,
      connected: true,
      currentUser: {
        pseudo: 'ffff',
        color: '#a0a',
      },
      messages: [

        { pseudo: 'ffff', timestamp: 1503792916,
          senderColor: '#a0a',
          message: 'sup', _id: '858cf07f-660b-4a69-9878-713b2bc04d6a',
          _rev: '1-b99bd717eb8e4fa685b9ea0210a570cb' },
        { pseudo: 'ffff', timestamp: 1503792918,
          senderColor: '#a0a',
          message: 'hey', _id: 'e086b6a8-b4d9-4669-f09e-fcb65e5d39b4',
          _rev: '1-1cc2fbb2e9c543d0bd8f871acbdf73d3' },
        {pseudo: "aaaa", timestamp: 1503793056,
         senderColor: '#00a',
         message: "hey", _id: "72c5e803-f509-4f39-9b01-dc47cac650d5",
         _rev: "1-6603e1a0b3474943a8f70e6397824f64"},
        {pseudo: "aaaa", timestamp: 1503793059,
         senderColor: '#00a',
         message: "what it is", _id: "a504259e-ecfc-483d-fb23-44c71125ded2",
         _rev: "1-155f315264194403ab360a46ddeb54d7"},
      ],
    },
  },

  // enter a message
  {
    happening: function (client, clientAPI) {
      clientAPI.setMessageInput({ target: { value: 'hey everyone' }})
    },
    state: {
      errors: [],
      online: {
        'ffff': '#a0a',
        'aaaa': '#00a',
      },
      pseudoInput: '',
      joining: false,
      colorChoice: null,
      leavingRoom: false,
      messagesLoading: false,
      messageInput: 'hey everyone',
      sendingMessageInput: false,
      connected: true,
      currentUser: {
        pseudo: 'ffff',
        color: '#a0a',
      },
      messages: [
        { pseudo: 'ffff', timestamp: 1503792916,
          senderColor: '#a0a',
          message: 'sup', _id: '858cf07f-660b-4a69-9878-713b2bc04d6a',
          _rev: '1-b99bd717eb8e4fa685b9ea0210a570cb' },
        { pseudo: 'ffff', timestamp: 1503792918,
          senderColor: '#a0a',
          message: 'hey', _id: 'e086b6a8-b4d9-4669-f09e-fcb65e5d39b4',
          _rev: '1-1cc2fbb2e9c543d0bd8f871acbdf73d3' },
        {pseudo: "aaaa", timestamp: 1503793056,
         senderColor: '#00a',
         message: "hey", _id: "72c5e803-f509-4f39-9b01-dc47cac650d5",
         _rev: "1-6603e1a0b3474943a8f70e6397824f64"},
        {pseudo: "aaaa", timestamp: 1503793059,
         senderColor: '#00a',
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
        'ffff': '#a0a',
        'aaaa': '#00a',
      },
      pseudoInput: '',
      joining: false,
      colorChoice: null,
      leavingRoom: false,
      messagesLoading: false,
      messageInput: 'hey everyone',
      // now we are 'sending' (send is pending)
      sendingMessageInput: true,
      connected: true,
      currentUser: {
        pseudo: 'ffff',
        color: '#a0a',
      },
      messages: [
        { pseudo: 'ffff', timestamp: 1503792916,
          senderColor: '#a0a',
          message: 'sup', _id: '858cf07f-660b-4a69-9878-713b2bc04d6a',
          _rev: '1-b99bd717eb8e4fa685b9ea0210a570cb' },
        { pseudo: 'ffff', timestamp: 1503792918,
          senderColor: '#a0a',
          message: 'hey', _id: 'e086b6a8-b4d9-4669-f09e-fcb65e5d39b4',
          _rev: '1-1cc2fbb2e9c543d0bd8f871acbdf73d3' },
        {pseudo: "aaaa", timestamp: 1503793056,
         senderColor: '#00a',
         message: "hey", _id: "72c5e803-f509-4f39-9b01-dc47cac650d5",
         _rev: "1-6603e1a0b3474943a8f70e6397824f64"},
        {pseudo: "aaaa", timestamp: 1503793059,
         senderColor: '#00a',
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
      pseudoInput: '',
      joining: false,
      colorChoice: null,
      leavingRoom: false,
      errors: [
        'Fake error'
      ],
      online: {
        'ffff': '#a0a',
        'aaaa': '#00a',
      },
      messagesLoading: false,
      messageInput: 'hey everyone',
      // now we are 'sending' (send is pending)
      sendingMessageInput: false,
      connected: true,
      currentUser: {
        pseudo: 'ffff',
        color: '#a0a',
      },
      messages: [
        { pseudo: 'ffff', timestamp: 1503792916,
          senderColor: '#a0a',
          message: 'sup', _id: '858cf07f-660b-4a69-9878-713b2bc04d6a',
          _rev: '1-b99bd717eb8e4fa685b9ea0210a570cb' },
        { pseudo: 'ffff', timestamp: 1503792918,
          senderColor: '#a0a',
          message: 'hey', _id: 'e086b6a8-b4d9-4669-f09e-fcb65e5d39b4',
          _rev: '1-1cc2fbb2e9c543d0bd8f871acbdf73d3' },
        {pseudo: "aaaa", timestamp: 1503793056,
         senderColor: '#00a',
         message: "hey", _id: "72c5e803-f509-4f39-9b01-dc47cac650d5",
         _rev: "1-6603e1a0b3474943a8f70e6397824f64"},
        {pseudo: "aaaa", timestamp: 1503793059,
         senderColor: '#00a',
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
      pseudoInput: '',
      joining: false,
      colorChoice: null,
      leavingRoom: false,
      errors: [
        'Fake error'
      ],
      online: {
        'ffff': '#a0a',
        'aaaa': '#00a',
      },
      messagesLoading: false,
      messageInput: 'hey everyone',
      // now we are 'sending' (send is pending)
      sendingMessageInput: true,
      connected: true,
      currentUser: {
        pseudo: 'ffff',
        color: '#a0a',
      },
      messages: [
        { pseudo: 'ffff', timestamp: 1503792916,
          senderColor: '#a0a',
          message: 'sup', _id: '858cf07f-660b-4a69-9878-713b2bc04d6a',
          _rev: '1-b99bd717eb8e4fa685b9ea0210a570cb' },
        { pseudo: 'ffff', timestamp: 1503792918,
          senderColor: '#a0a',
          message: 'hey', _id: 'e086b6a8-b4d9-4669-f09e-fcb65e5d39b4',
          _rev: '1-1cc2fbb2e9c543d0bd8f871acbdf73d3' },
        {pseudo: "aaaa", timestamp: 1503793056,
         senderColor: '#00a',
         message: "hey", _id: "72c5e803-f509-4f39-9b01-dc47cac650d5",
         _rev: "1-6603e1a0b3474943a8f70e6397824f64"},
        {pseudo: "aaaa", timestamp: 1503793059,
         senderColor: '#00a',
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
        'ffff': '#a0a',
        'aaaa': '#00a',
      },
      pseudoInput: '',
      joining: false,
      colorChoice: null,
      leavingRoom: false,
      messagesLoading: false,
      messageInput: '',
      // now we are 'sending' (send is pending)
      sendingMessageInput: false,
      connected: true,
      currentUser: {
        pseudo: 'ffff',
        color: '#a0a',
      },
      messages: [
        { pseudo: 'ffff', timestamp: 1503792916,
          senderColor: '#a0a',
          message: 'sup', _id: '858cf07f-660b-4a69-9878-713b2bc04d6a',
          _rev: '1-b99bd717eb8e4fa685b9ea0210a570cb' },
        { pseudo: 'ffff', timestamp: 1503792918,
          senderColor: '#a0a',
          message: 'hey', _id: 'e086b6a8-b4d9-4669-f09e-fcb65e5d39b4',
          _rev: '1-1cc2fbb2e9c543d0bd8f871acbdf73d3' },
        {pseudo: "aaaa", timestamp: 1503793056,
         senderColor: '#00a',
         message: "hey", _id: "72c5e803-f509-4f39-9b01-dc47cac650d5",
         _rev: "1-6603e1a0b3474943a8f70e6397824f64"},
        {pseudo: "aaaa", timestamp: 1503793059,
         senderColor: '#00a',
         message: "what it is", _id: "a504259e-ecfc-483d-fb23-44c71125ded2",
         _rev: "1-155f315264194403ab360a46ddeb54d7"},
      ],
    },
  },

  // leave room, we're now leavingRoom
  {
    happening: function (client, clientAPI) {
      // console.log('waiting for cb again')
    },
    state: {
      errors: [
        'Fake error'
      ],
      online: {
        'ffff': '#a0a',
        'aaaa': '#00a',
      },
      pseudoInput: '',
      joining: false,
      colorChoice: null,
      leavingRoom: true,
      messagesLoading: false,
      messageInput: '',
      // now we are 'sending' (send is pending)
      sendingMessageInput: false,
      connected: true,
      currentUser: {
        pseudo: 'ffff',
        color: '#a0a',
      },
      messages: [
        { pseudo: 'ffff', timestamp: 1503792916,
          senderColor: '#a0a',
          message: 'sup', _id: '858cf07f-660b-4a69-9878-713b2bc04d6a',
          _rev: '1-b99bd717eb8e4fa685b9ea0210a570cb' },
        { pseudo: 'ffff', timestamp: 1503792918,
          senderColor: '#a0a',
          message: 'hey', _id: 'e086b6a8-b4d9-4669-f09e-fcb65e5d39b4',
          _rev: '1-1cc2fbb2e9c543d0bd8f871acbdf73d3' },
        {pseudo: "aaaa", timestamp: 1503793056,
         senderColor: '#00a',
         message: "hey", _id: "72c5e803-f509-4f39-9b01-dc47cac650d5",
         _rev: "1-6603e1a0b3474943a8f70e6397824f64"},
        {pseudo: "aaaa", timestamp: 1503793059,
         senderColor: '#00a',
         message: "what it is", _id: "a504259e-ecfc-483d-fb23-44c71125ded2",
         _rev: "1-155f315264194403ab360a46ddeb54d7"},
      ],
    },
  },

  // now we've left room, no messages, just who is online
  {
    happening: function (client, clientAPI) {
      clientAPI.leave()
    },
    state: {
      errors: [
        'Fake error'
      ],
      online: {
        'ffff': '#a0a',
        'aaaa': '#00a',
      },
      pseudoInput: '',
      joining: false,
      colorChoice: null,
      leavingRoom: false,
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
        'ffff': '#a0a',
        'aaaa': '#00a',
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
