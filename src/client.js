const socketClient = require('socket.io-client')

function createClient (serverUrl) {
  const socket = socketClient(serverUrl)

  socket.join = function joinRoom (psuedonym, color, cb) {
    socket.emit('join', psuedonym, color, cb)
  }

  socket.leave = function leave (cb) {
    socket.emit('leave', cb)
  }

  return socket
}

module.exports = createClient
