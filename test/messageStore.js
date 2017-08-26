const test = require('tape')
const moment = require('moment')

const localDbName = 'mydb'
const serverDbPath = 'http://localhost:5984/theirRemoteDb'
// mutable reference (gets assigned during tests)
let serverDb = null
let clientDb = null
let clientSync = null

/*
  Messages datastore
*/
const messageStore = require('..').messageStore

const exampleMessage = {
  pseudo: 'ffff',
  timestamp: moment().unix(),
  message: 'sup'
}

test('can create a server message store', t => {
  serverDb = messageStore.createServerMessageStore(serverDbPath)
  t.ok(serverDb)
  t.ok(serverDb.post)
  serverDb.post(exampleMessage)
    .catch(err => {
      t.notOk(err)
      t.end()
    })
    .then(res => {
      t.ok(res)
      t.end()
    })
})

test('can create a client message store', t => {
  // create a client db
  let clientDbMess = messageStore.createClientMessageStore(localDbName, serverDbPath)
  // update ref to client db
  clientDb = clientDbMess.db
  clientSync = clientDbMess.sync
  // catch errors from the sync
  clientSync
    // .on('active', _ => {
    //   t.ok(true)
    // })
    .on('error', err => {
      t.notOk(err, err)
    })
  t.ok(clientDb)
  t.ok(clientSync)
  t.end()
})

test('posts are synced!', t => {
  clientSync
    .on('change', change => {
      t.ok(change, change)
      t.deepEquals(
        change.docs[0].pseudo,
        'ffff',
      )
      t.deepEquals(
        change.docs[0].message,
        'sup',
      )
      t.deepEquals(
        change.docs[1].pseudo,
        'ffff',
      )
      t.deepEquals(
        change.docs[1].message,
        'cool post',
      )
      t.end()
    })
  exampleMessage.message = 'cool post'
  serverDb.post(exampleMessage)
})

test.onFinish(_ => {
  clientDb.destroy()
  serverDb.destroy()
  clientDb.close()
  serverDb.close()
  clientSync.cancel()
})
