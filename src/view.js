var hyperx = require('hyperx')
var vdom = require('virtual-dom')
var hyperx = require('hyperx')
var hx = hyperx(vdom.h)


function render (api, state) {

  function input () {
    return hx`<div>
    <button onclick=${api.sendMessageInput}
            ${state.sendingMessageInput ? 'disabled' : ''}>
      send</button>
    <input id="messageInput"
           onchange=${api.setMessageInput}
           value=${state.messageInput}>
  </div>`
  }

  return hx`<div>
    <h1>my great webapp</h1>
    ${input()}
  </div>`
}

module.exports = render

// text input
//  .
//  .
//  auto-focus input box
// errors
// - display errors
// - clear errors
