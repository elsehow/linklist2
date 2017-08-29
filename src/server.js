const path = require('path')
const express = require('express')
const fs = require('fs')
const validators = require('./validators')
const socket = require('socket.io')
const partial = require('lodash.partial')
const messageStore = require('./messageStore')
const moment = require('moment')


function route (errorMsgs, serverCb, clientCb) {
  for (errorMessage of errorMsgs) {
    // if there's an error message,
    if (errorMessage) {
      clientCb(errorMessage.toString())
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
    client.color = hex
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


function post (io, client, db, messageBody, cb) {
  let message = {
    pseudo: client.pseudo,
    timestamp: moment().unix(),
    message: messageBody,
    senderColor: client.color,
  }
  let errorMsgs = [
    validators.message(message),
    validators.postAction(client.pseudo, online),
  ]
  function serverCb () {
    db.post(message)
      .catch(err => console.log('ERROR!', err))
  }
  route(errorMsgs, serverCb, cb)
}


/*
  createServer method
  This gets exposed to callers.
  */

function createServer (dbHost, config) {

  const app = express()
  const serv = require('http').createServer(app)
  // const serv = require('http').createServer()
  const io = socket(serv)
  const db = messageStore.createServerMessageStore(dbHost, config['auth'])

  // upon connection
  io.on('connection', client => {
    // setup routes
    client.on('join', partial(join, io, client))
    client.on('leave', partial(leave, io, client))
    client.on('disconnect', partial(disconnect, io, client))
    client.on('post', partial(post, io, client, db))
  })

  serv.db = db

  serv.stop = function () {
    serv.close()
    db.close()
  }

  app.use(express.static('dist/'))

  // serv.on('request', function(request, response) {
  //   fs.createReadStream('dist/index.html').pipe(response)
  // })

  serv.listen(config['port'])
  return serv
}

module.exports = createServer
