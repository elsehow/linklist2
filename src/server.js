const validators = require('./validators')
const socket = require('socket.io')
const partial = require('lodash.partial')


function route (errorMsgs, serverCb, clientCb) {
  for (errorMessage of errorMsgs) {
    // if there's an error message,
    if (errorMessage) {
      // call the client's cb on it
      clientCb(errorMessage)
      // exit the method
      return
    }
  }
  // if we're still here
  // do the server's cb
  serverCb()
  // and call back `false` for the client,
  // as there are no errors
  clientCb(false)
}


// mutable application state
let online = {}


/*
  Route methods
  */

function join (io, client, pseudo, hex, cb) {
  let errorMsgs = [
    validators.pseudonym(pseudo),
    validators.hexColor(hex),
    validators.join(client, online, pseudo)
  ]
  function serverCb () {
    // set their pseudonym in socket
    client.pseudo = pseudo
    // mark user as online
    client.online = true
    online[pseudo] = hex
    // give everyone the new list of people online
    io.emit('online', online)
  }
  route(errorMsgs, serverCb, cb)
}


function leave (io, client, cb) {
  let errorMsgs = [
    validators.leave(client),
  ]
  function serverCb () {
    // mark user no longer online
    client.online = false
    // remove client from online list
    delete online[client.pseudo]
    // give everyone the new list of people online
    io.emit('online', online)
  }
  route(errorMsgs, serverCb, cb)
}


function disconnect (io, client) {
  if (client.online)
    leave(io, client, () => {})
}


/*
  createServer method
  This gets exposed to callers.
  */

function createServer (port) {

  const serv = require('http').createServer();
  const io = socket(serv)

  io.on('connection', client => {
    // console.log('client connected!')
    // client.on('disconnect', _ => {
    //   console.log('client disconnected!')
    // })
    // routes
    client.on('join', partial(join, io, client))
    client.on('leave', partial(leave, io, client))
    client.on('disconnect', partial(disconnect, io, client))

  })
  serv.listen(port)

  return serv
}

module.exports = createServer
