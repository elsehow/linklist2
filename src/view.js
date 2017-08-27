var hyperx = require('hyperx')
var vdom = require('virtual-dom')
var hyperx = require('hyperx')
var hx = hyperx(vdom.h)

var colors = [
  '#a00',
  '#0a0',
  '#00a',
]

function render (api, state) {

  function errors () {
    let errorLis = state.errors.map(e => hx`<li>${e}</li>`)
    return hx`<div>
      <ul>${errorLis}</ul>
      <button onclick=${api.clearErrors}>x</button>
    </div>`
  }

  function colorPicker () {
    function colorButton (c) {
      return hx`<div
        style="width: 20px; height: 20px;
        background-color:${c};
        ${ state.colorChoice === c  ?  "border: 2px solid #eee;" : "" }
      "
      onclick=${() => api.setColorChoice(c)}>
      </div>`
    }
    return hx`<div>
      ${colors.map(colorButton)}
    </div>`
  }

  function join () {
    return hx`<div>
    <button onclick=${api.join}
            ${state.joining ? 'disabled' : ''}>
      join</button>
    ${colorPicker()}
    <input id="focusedInput"
           onchange=${api.setPseudoInput}
           value=${state.pseudoInput}>
    </div>`
  }

  function input () {
    return hx`<div>
    <button onclick=${api.sendMessageInput}
            ${state.sendingMessageInput ? 'disabled' : ''}>
      send</button>
    <input id="focusedInput"
           onchange=${api.setMessageInput}
           value=${state.messageInput}>
  </div>`
  }

  function message (m) {
    return hx`<div>
${m.message}
</div>`
  }

  function messages () {
    let displayedMessages = state.messages.map(message)
    return hx`<div>
${ state.messagesLoading ?
  "loading..."
  :
  state.messages.length ?
    displayedMessages
    :
    "No messages!"
}
</div>`
  }

  function room () {
    return hx`<div>
      ${input()}
      ${messages()}
    </div>`
  }

  return hx`<div>
    <h1>my great webapp</h1>
    ${ state.errors.length ? errors() : '' }
    ${ state.currentUser ? room() : join() }
  </div>`
}

module.exports = render

// text input
//  . //  . //  .
// errors
//   . //   . //   .
// join screen
//   . //   . //   . //   . //   .


// messages
//   show loading spinner when loading
//   show messages in order
// online users
//   show who is online
//   show who you are logged in as
// details
//   show connected status
//   show loading spinner
//   enter sends message
