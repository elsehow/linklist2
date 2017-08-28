module.exports = [

  // initial state
  {
    happening: function (client) {
      console.log('waiting for cb')
      // client.emit('ready')
    },
    state: () => {
      return {
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
      }
    },
  },

  // connect to server
  {
    happening: function (client) {
      client.emit('connect')
    },
    state: (lastState) => {
      lastState.connected = true
      return lastState
    },
  },

  // oops, disconnected
  {
    happening: function (client) {
      client.emit('disconnect')
    },
    state: lastState => {
      lastState.connected = false
      return lastState
    },
  },

  // reconnect
  {
    happening: function (client) {
      client.emit('connect')
    },
    state: lastState => {
      lastState.connected = true
      return lastState
    },
  },

  // set pseudo input
  {
    happening: function (client, clientAPI) {
      clientAPI.setPseudoInput(
        {target: { value: 'ffff' }})
    },
    state: lastState => {
      lastState.pseudoInput = 'ffff'
      return lastState
    },
  },

  // set color choice
  {
    happening: function (client, clientAPI) {
      clientAPI.setColorChoice('#a0a')
    },
    state: lastState => {
      lastState.colorChoice = '#a0a'
      return lastState
    },
  },

  // join
  {
    happening: function (client, clientAPI) {
      clientAPI.join()
    },
    state: lastState => {
      lastState.joining = true
      return lastState
    },
  },


  // ERROR! Bad username
  {
    happening: function (client, clientAPI) {
      // console.log('waiting for callback...')
    },
    state: lastState => {
      lastState.errors = [
        'Fake error',
      ]
      lastState.joining = false
      return lastState
    },
  },

  // clear errors
  {
    happening: function (client, clientAPI) {
      clientAPI.clearErrors()
    },
    state: lastState => {
      lastState.errors = []
      return lastState
    },
  },

  // try to join again
  // join
  {
    happening: function (client, clientAPI) {
      clientAPI.join()
    },
    state: lastState => {
      lastState.joining = true
      return lastState
    },
  },

  // join complete
  {
    happening: function (client, clientAPI) {
      // console.log('waiting for cb')
    },
    state: lastState => {
      lastState.joining = false
      lastState.messagesLoading = true
      lastState.currentUser = {
        pseudo: 'ffff',
        color: '#a0a',
      }
      return lastState
    },
  },

  // room joined, just loaded messages
  {
    happening: function (client, clientAPI) {
      client.store.fetchAllMessages()
    },
    state: lastState => {
      lastState.messagesLoading = false
      lastState.messages = [
        { pseudo: 'ffff', timestamp: 1503792918,
          senderColor: '#a0a',
          message: 'sup<br>hey', _id: 'e086b6a8-b4d9-4669-f09e-fcb65e5d39b4', _rev: '1-1cc2fbb2e9c543d0bd8f871acbdf73d3' },
      ]
      return lastState
    },
  },

  // a 'change' event happens, messages are merged & sorted
  {
    happening: function (client, clientAPI) {
      client.store.sync.emit('change', client.mockChange)
    },
    state: lastState => {
      lastState.messages = [

        {
          "pseudo": "ffff",
          "timestamp": 1503793059,
          "message": "hey<br>what it is",
          "senderColor": '#00a',
          "_id": "a504259e-ecfc-483d-fb23-44c71125ded2",
          "_rev": "1-155f315264194403ab360a46ddeb54d7"
        },
        { pseudo: 'ffff', timestamp: 1503792918,
          senderColor: '#a0a',
          message: 'sup<br>hey', _id: 'e086b6a8-b4d9-4669-f09e-fcb65e5d39b4', _rev: '1-1cc2fbb2e9c543d0bd8f871acbdf73d3' },
      ]
      return lastState
    }
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
    state: lastState => {
      lastState.online = {
          'ffff': '#a0a',
          'aaaa': '#00a',
        }
      return lastState
    }
  },

  // enter a message
  {
    happening: function (client, clientAPI) {
      clientAPI.setMessageInput({ target: { value: 'hey everyone' }})
    },
    state: lastState => {
      lastState.messageInput = 'hey everyone'
      return lastState
    }
  },

  // send the message
  {
    happening: function (client, clientAPI) {
      clientAPI.sendMessageInput()
    },
    state: lastState => {
      lastState.sendingMessageInput = true
      return lastState
    }
  },

  // server error! message still in box
  {
    happening: function (client, clientAPI) {
      // console.log('waiting for cb...')
    },
    state: lastState => {
      lastState.sendingMessageInput = false
      lastState.errors = [
        'Fake error'
      ]
      return lastState
    }
  },

  // send message, it's pending, message still in box
  {
    happening: function (client, clientAPI) {
      clientAPI.sendMessageInput()
    },
    state: lastState => {
      lastState.sendingMessageInput = true
      return lastState
    }
  },

  // now it's sent, disappears from box
  {
    happening: function (client, clientAPI) {
      // console.log('waiting for cb again')
    },
    state: lastState => {
      lastState.messageInput = ''
      lastState.sendingMessageInput = false
      return lastState
    }
  },

  // leave room, we're now leavingRoom
  {
    happening: function (client, clientAPI) {
      clientAPI.leave()
    },
    state: lastState => {
      lastState.leavingRoom = true
      return lastState
    }
  },

  // now we've left room, no messages, just who is online
  {
    happening: function (client, clientAPI) {
      // console.log('waiting for cb')
    },
    state: lastState => {
      lastState.leavingRoom = false
      lastState.currentUser = null
      lastState.messages = []
      return lastState
    }
  },

  // a 'change' event won't show up if we have not 'joined'
  {
    happening: function (client, clientAPI) {
      client.store.sync.emit('change', client.mockChange)
    },
    state: lastState => {
      return lastState
    }
  },
]
