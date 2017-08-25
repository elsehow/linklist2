const test = require('tape')
const socketClient = require('socket.io-client')
const mod = require('..')

// test config
const serverPort = 3000
const serverUrl = 'http://localhost:'+serverPort
const ioServer = mod.server(serverPort)
let socket = null; // we will assign this later

test('can start server', t => {
  t.ok(ioServer)
  t.end()
})

test('can connect to server', t => {
  socket = socketClient(serverUrl)
  socket.on('connect', function () {
    t.ok(true, 'connected to server')
    t.end()
  })
})

test.onFinish(_ => {
  ioServer.close()
  socket.close()
})
