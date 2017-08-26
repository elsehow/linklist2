const socketClient = require('socket.io-client')
const messageStore = require('./messageStore')

function createClient (serverUrl, localDbName, serverDbPath) {
  const socket = socketClient(serverUrl)

  socket.join = function joinRoom (psuedonym, color, cb) {
    socket.emit('join', psuedonym, color, cb)
  }

  socket.leave = function leave (cb) {
    socket.emit('leave', cb)
  }

  socket.post = function post (messageBody, cb) {
    socket.emit('post', messageBody, cb)
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
