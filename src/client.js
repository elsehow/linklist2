const socketClient = require('socket.io-client')
const messageStore = require('./messageStore')

function createClient (serverUrl, localDbName, serverDbPath) {

  const socket = socketClient(serverUrl)
  const store = messageStore.createClientMessageStore(localDbName, serverDbPath)

  function handle (cb) {
    return function (errorMessage) {
      socket.emit('error', errorMessage)
      if (cb)
        cb(errorMessage)
    }
  }

  socket.join = function joinRoom (psuedonym, color, cb) {
    let handler = handle(cb)
    socket.emit('join', psuedonym, color, function (res) {
      // if no issues on join,
      if (!res) {
        // fetch all the messagse
        store
          .fetchAllMessages()
          .then(all => {
            store.sync.emit('all-messages', all)
          })
          .catch(err => store.db.emit('error', err))
      }
      handler(res)
    })
  }

  socket.leave = function leave (cb) {
    socket.emit('leave', handle(cb))
  }

  socket.post = function post (messageBody, cb) {
    socket.emit('post', messageBody, handle(cb))
  }

  socket.store = store

  socket.stop = function () {
    store.db.close()
    store.sync.cancel()
    socket.close()
  }

  setTimeout(() => socket.emit('ready'), 100)
  return socket
}

module.exports = createClient
