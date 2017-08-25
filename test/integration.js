

const test = require('tape')
const linklist = require('..')


// test config
const serverPort = 3000
const serverUrl = 'http://localhost:'+serverPort
// we will assign these refs later
let ioServer = null
let client = null
let client2 = null


test('can start server', t => {
  ioServer = linklist.createServer(serverPort)
  t.ok(ioServer)
  t.end()
})


test('can connect to server', t => {
  client = linklist.createClient(serverUrl)
  client.on('connect', function () {
    t.ok(true, 'connected to server')
    t.end()
  })
})


test('clients can join, leave rooms, receive online state', t => {
  t.plan(11)
  let login = 0 // mutable login counter

  /*
    Validation
    */

  // join with bad pseudonym
  client.join('', '#fff', function (res) {
    t.deepEquals(
      res,
      'Pseuodnym must be between 1 and 24 characters'
    )
  })
  // join with bad color
  client.join('ffff', 'fff', function (res) {
    t.deepEquals(
      res,
      'Not a valid hex color'
    )
  })
  // join with bad pseudo AND color
  client.join('', 'fff', function (res) {
    t.deepEquals(
      res,
      'Pseuodnym must be between 1 and 24 characters'
    )
  })

  /*
    Joining
    */

  client.on('online', online => {
    if (login == 0) {
      t.deepEquals(
        online,
        { 'ffff': '#fff' },
        'login 0, 1 user online (ffff)'
      )
      login+=1
    } else if (login == 1){
      t.deepEquals(
        online,
        { 'ffff': '#fff', 'eeee': '#eee' },
        'login 1, two users online (ffff, eeee)'
      )
      login+=1
      // client should leave now
      client2.leave(function (res) {
        t.notOk(
          res,
          'client2 can leave without errors'
        )
      })

    } else {
      t.deepEquals(
        online,
        { 'ffff': '#fff' },
        'login 2, post-logout, one users online (ffff)'
      )
    }
  })

  client.join('ffff', '#fff', function (res) {
    t.notOk(
      res,
      'join wth good pseudonym'
    )
  })

  client.join('eeee', '#eee', function (res) {
    t.deepEquals(
      res,
      'You have already joined',
      'cannot join now that im already joined!'
    )
  })

  client2 = linklist.createClient(serverUrl)
  client2.join('ffff', '#eee', function (res) {
    t.deepEquals(
      res,
      'That pseudonym is already taken',
      'client2 cannot join with the same name as me!'
    )
  })

  client2.join('eeee', '#eee', function (res) {
    t.notOk(
      res,
      'client2 can join with a differnet username, no errors'
    )
  })

})


test.onFinish(_ => {
  ioServer.close()
  client.close()
  client2.close()
})
