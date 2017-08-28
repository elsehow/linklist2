const test = require('tape')
const moment = require('moment')

const localDbName = 'mydb'
const serverDbPath = 'http://localhost:5984/theirremotedb'
// mutable reference (gets assigned during tests)
let serverDb = null
let store = null

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
  store = messageStore.createClientMessageStore(localDbName, serverDbPath)
  t.ok(store.db)
  t.ok(store.sync)
  // catch errors from the sync
  store
    .sync
    // .on('active', _ => {
    //   t.ok(true)
    // })
    .on('error', err => {
      t.notOk(err, err)
    })
  t.end()
})

test('posts are synced!', t => {
  store
    .sync
    .on('change', change => {
      t.ok(change, change)
      t.deepEquals(
        change.docs[0].pseudo,
        'ffff',
      )
      t.deepEquals(
        change.docs[1].pseudo,
        'ffff',
      )
      t.equals(
        change.docs.length,
        2
      )
      t.end()
    })
  exampleMessage.message = 'wow'
  serverDb.post(exampleMessage)
})

test('can fetch all messages', t => {
  store
    .fetchAllMessages()
    .then(messages => {
      t.end()
    })
    .catch(err => {
      t.notOk(err)
      t.end()
    })
})

test.onFinish(_ => {
  store.db.destroy()
  serverDb.destroy()
  store.db.close()
  serverDb.close()
  store.sync.cancel()
})
