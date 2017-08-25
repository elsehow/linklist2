

const validators = require('./validators')
const socket = require('socket.io')


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
      for (errorMessage of [
        validators.pseudonym(pseudo),
        validators.hexColor(hex),
        client.online ? 'You have already joined' : false,
        online[pseudo] ? 'That pseudonym is already taken' : false,
      ]) {
        // if there's an error message,
        if (errorMessage) {
          // call back on it
          cb(errorMessage)
          // exit the method
          return
        }
      }
      // if we're still here, everything was fine
      // set their pseudonym in socket
      client.pseudo = pseudo
      // mark user as online
      client.online = true
      online[pseudo] = hex
      // give everyone the new list of people online
      io.emit('online', online)
      // call back `false` for no errors
      cb(false)
    })

    /*
      User leaving
    */
    client.on('leave', cb => {
      for (errorMessage of [
        !client.online ? 'You cannot leave if you have not joined' : false,
      ]) {
        // if there's an error message,
        if (errorMessage) {
          // call back on it
          cb(errorMessage)
          // exit the method
          return
        }
      }
      // if we're still here
      // mark user no longer online
      client.online = false
      // remove client from online list
      delete online[client.pseudo]
      // give everyone the new list of people online
      io.emit('online', online)
      // call back `false` for no errors
      cb(false)
    })

  })
  serv.listen(port)

  return serv
}

module.exports = createServer
