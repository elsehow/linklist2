const socketClient = require('socket.io-client')
const messageStore = require('./messageStore')

function createClient (serverUrl, localDbName, serverDbPath) {
  const socket = socketClient(serverUrl)

  function handle (cb) {
    return function (errorMessage) {
      socket.emit('error', errorMessage)
      cb(errorMessage)
    }
  }

  socket.join = function joinRoom (psuedonym, color, cb) {
    socket.emit('join', psuedonym, color, handle(cb))
  }

  socket.leave = function leave (cb) {
    socket.emit('leave', handle(cb))
  }

  socket.post = function post (messageBody, cb) {
    socket.emit('post', messageBody, handle(cb))
  }

  socket.store = messageStore.createClientMessageStore(localDbName, serverDbPath)

  socket.stop = function () {
    socket.store.db.close()
    socket.store.sync.cancel()
    socket.close()
  }

  return socket
}

module.exports = createClient
