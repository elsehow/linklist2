

const validators = require('./validators')
const socket = require('socket.io')


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

function createServer (port) {

  const serv = require('http').createServer();
  const io = socket(serv)

  io.on('connection', client => {

    console.log('client connected!')

    client.on('disconnect', _ => {
      console.log('client disconnected!')
    })

    /*
      User joining
      */

    client.on('join', (pseudo, hex, cb) => {
      let errorMsgs = [
        validators.pseudonym(pseudo),
        validators.hexColor(hex),
        client.online ? 'You have already joined' : false,
        online[pseudo] ? 'That pseudonym is already taken' : false,
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
    })

    /*
      User leaving
    */
    client.on('leave', cb => {
      let errorMsgs = [
        !client.online ? 'You cannot leave if you have not joined' : false,
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
    })

  })
  serv.listen(port)

  return serv
}

module.exports = createServer
