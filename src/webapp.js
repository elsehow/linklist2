var vdom = require('virtual-dom')
var main = require('main-loop')
var partial = require('lodash.partial')

// TODO HACK import mock states
var mockStates = require('../test/mocks/clientStates').map(s => s.state)
// TODO mock client for now
const mockClient = require('../test/mocks/client')
const store = require('.')
      .createStateReducer(mockClient)

// setup page
var render = partial(
  require('./view'),
  store.clientAPI
)

var loop = main(
  // store.getState(),
  // HACK mock
  mockStates[10],
  render, vdom)

// wire up events eventually
// TODO
// store.subscribe(loop.update)
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


