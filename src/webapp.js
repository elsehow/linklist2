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
// put the loop on the page
document.querySelector('#content').appendChild(loop.target)
// TODO // bind enter key to send
// document.onkeypress = e => {
//   if (e.which == 13)
//     store.clientAPI.sendMessageInput()
// }
// set input box to focus
// (there will be at least ONE input box called
//  `focusedInput` at any time)
document.getElementById("focusedInput").focus()



