const PouchDB = require('pouchdb')

function createClientMessageStore (name, remoteHost) {
  const localDB = new PouchDB(name)
  // emits messages:
  // - 'change'
  // - 'error'
  // - 'paused'
  // - 'active'
  const sync = localDB.replicate.from(remoteHost, {
    live: true,
    retry: true,
  })
  return {
    db: localDB,
    sync: sync,
  }
}


function createServerMessageStore (name) {
  const db = new PouchDB(name)
  return db
}


module.exports = {
  createClientMessageStore: createClientMessageStore,
  createServerMessageStore: createServerMessageStore,
}
