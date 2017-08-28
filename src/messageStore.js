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

  function fetchAllMessages () {
    return localDB
      .allDocs({
        include_docs: true,
      })
  }

  return {
    db: localDB,
    sync: sync,
    fetchAllMessages: fetchAllMessages,
  }
}


function createServerMessageStore (name, auth) {
  const db = new PouchDB(name, { auth: auth })
  return db
}


module.exports = {
  createClientMessageStore: createClientMessageStore,
  createServerMessageStore: createServerMessageStore,
}
