const vdom = require('virtual-dom')
const main = require('main-loop')
const partial = require('lodash.partial')
const config = require('../conf.prod.json')

const createClient = require('./client')

const client = createClient(
  config['client']['serverURL'],
  config['client']['dbName'],
  config['masterDbPath'],
)

const store = require('./stateReducer')(client)

// setup page
const render = partial(
  require('./view'),
  store.clientAPI
)

const loop = main(
  store.getState(),
  render, vdom)

// wire up events
store.subscribe(loop.update)
// refresh the state every minute, to prompt any view changes
// (for example, setting human-readable dates)
setTimeout(
  () => loop.update(store.getState()),
  1000
)
// put the loop on the page
document.querySelector('#content').appendChild(loop.target)



