const test = require('tape')
const linklist = require('..')

const config = require('../conf.test.json')

// we will assign these refs later
let ioServer = null
let client = null
let client2 = null
let client3 = null


test('can start server', t => {
  ioServer = linklist.createServer(
    config['masterDbPath'],
    config['server']
  )
  t.ok(ioServer)
  t.end()
})


test('can connect to server', t => {
  client = linklist.createClient(
    config['client']['serverURL'],
    config['client']['dbName'],
    config['masterDbPath']
  )
  client.on('connect', function () {
    t.ok(true, 'connected to server')
    t.end()
  })
})


test('clients can join, leave rooms, receive online state', t => {
  t.plan(15)
  let login = 0 // mutable login counter

  /*
    Validation
    */

  // join with bad pseudonym
  client.join('', '#fff', function (res) {
    t.deepEquals(
      res,
      linklist.validators.messages['PSEUDO_BAD_LENGTH']
    )
  })
  // join with bad color
  client.join('ffff', 'fff', function (res) {
    t.deepEquals(
      res,
      linklist.validators.messages['HEX_INVALID']
    )
  })
  // join with bad pseudo AND color
  client.join('', 'fff', function (res) {
    t.deepEquals(
      res,
      linklist.validators.messages['PSEUDO_BAD_LENGTH']
    )
  })

  /*
    Joining
    */


  client.store.sync.on('all-messages', all => {
    t.ok(all, 'fetch messages once after join')
  })

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
        client2.leave(function (res) {
          t.deepEquals(
            res,
            linklist.validators.messages['LEAVE_HAVE_NOT_JOINED'],
            'error when I leave if i have not joined'
          )
        })
      })

    } else if (login == 2){
      t.deepEquals(
        online,
        { 'ffff': '#fff' },
        'login 2, post-logout, one user online (ffff)'
      )
      // try joining and disconnecting
      client3 = linklist.createClient(
        config['client']['serverURL'],
        config['client']['dbName']+'3',
        config['masterDbPath'])
      client3.join('aaaa', '#aaa', function (res) {})
      login+=1
    } else if (login == 3) {
      t.deepEquals(
        online,
        { 'ffff': '#fff', 'aaaa': '#aaa' },
        'login 3, post-login, two users online (ffff, aaaa)'
      )
      client3.close()
      login+=1
    } else if (login == 4) {
      t.deepEquals(
        online,
        { 'ffff': '#fff' },
        'login 4, post-close, one user online (ffff)'
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
      linklist.validators.messages['JOIN_ALREADY_JOINED'],
      'cannot join now that im already joined!'
    )
  })

  client2 = linklist.createClient(
    config['client']['serverURL'],
    config['client']['dbName']+'2',
    config['masterDbPath']
  )
  client2.join('ffff', '#eee', function (res) {
    t.deepEquals(
      res,
      linklist.validators.messages['JOIN_PSEUDO_TAKEN'],
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

test('client can post, receive message from db', t => {

  // necessary ingredients exists
  t.ok(client.store.sync)
  t.ok(client.store.db)
  t.ok(client.post)

  // receive message
  client.store.sync.on('change', change => {
    t.deepEquals(
      change.docs[0].pseudo,
      'ffff'
    )
    t.deepEquals(
      change.docs[0].senderColor,
      '#fff'
    )
    t.deepEquals(
      change.docs[0].message,
      'Hello sweet world'
    )
    t.end()
  })

  // NOTE even though client2 has left, should receive message
  client2.store.sync.on('change', t.ok)

  // post message
  client.post(function () { console.log('bad')}, function (res) {
    // should error, sending a non-string
    t.ok(res, res)
    // this should be fine
    client.post('Hello sweet world', function (res) {
      t.notOk(res)
    })
  })

})

test('client who has not joined cannot post', t => {
  client2.post('hax', function (res) {
    t.deepEqual(
      res,
      linklist.validators.messages['POSTACTION_SENDER_NOT_JOINED']
    )
    t.end()
  })
})

test.onFinish(_ => {
  ioServer.db.destroy()
  client.store.db.destroy()
  client2.store.db.destroy()
  client3.store.db.destroy()
  ioServer.stop()
  client.stop()
  client2.stop()
  client3.stop()
})
