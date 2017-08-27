const vdom = require('virtual-dom')
const main = require('main-loop')
const partial = require('lodash.partial')
const config = require('../conf.json')

// TODO HACK import mock states
// const mockStates = require('../test/mocks/clientStates').map(s => s.state)
// TODO mock client for now
// const client = require('../test/mocks/client')

const createClient = require('.').createClient

const client = createClient(
  config['client']['serverURL'],
  config['client']['dbName'],
  config['masterDb'],
)

const store = require('.')
      .createStateReducer(client)

// setup page
const render = partial(
  require('./view'),
  store.clientAPI
)

const loop = main(
  store.getState(),
  // HACK mock
  // mockStates[10],
  render, vdom)

// wire up events eventually
// TODO
store.subscribe(loop.update)
// refresh the state every minute, to prompt any view changes
// (for example, setting human-readable dates)
setTimeout(
  () => loop.update(store.getState()),
  1000
)
// put the loop on the page
document.querySelector('#content').appendChild(loop.target)



