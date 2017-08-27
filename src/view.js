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

  function currentlyOnline () {
    let users = Object.keys(state.online)
        .map(function (user) {
          return hx`<div
           style="color: ${state.online[user]};">
            ${user}
          </div>`
        })
    return hx`<div>Online: ${users}</div>`
  }

  function loading () {
    return hx`<div>loading...</div>`
  }

  function message (m) {
    return hx`<div
                 style="display: flex;"
>
<div
  style="background-color: ${m.senderColor};
         width: 5px;
         align-items: stretch;
         align-content: stretch;
">
</div>
<div style="flex-grow:1">
  <div> ${m.pseudo} </div>
  <div> ${m.timestamp} </div>
  <div> ${m.message} </div>
</div>
</div>`
  }

  function messages () {
    let displayedMessages = state.messages.map(message)
    return hx`<div>
${ state.messagesLoading ?
  loading()
  :
  state.messages.length ?
    displayedMessages
    :
    "No messages!"
}
</div>`
  }

  function leaveRoom () {
    return hx`<button
       onclick=${api.leave}
       ${state.leavingRoom ? 'disabled' : ''}>
    >leave room</button>`
  }

  function room () {
    return hx`<div>
      ${leaveRoom()}
      ${input()}
      ${messages()}
    </div>`
  }

  return hx`<div>
    <h1>my great webapp</h1>
    ${ state.errors.length ? errors() : '' }
    ${ currentlyOnline() }
    ${ state.currentUser ? room() : join() }
  </div>`
}

module.exports = render

// text input //  . //  . //  . // errors //   . //   . //   . // join screen //   . //   . //   . //   . //   . // online users //   . // messages //   . //   ... //   . //   . //   . //       . //      . // leave chat too //  ... //   integration //    .

// set it up for real...
//   config
//     routes
//     dbs
//   serv
//   play, find bugs and notice

// details
//   enter sends message
//   loading spinner
//   spinner on join, send buttons when waiting
//   cannot send/join unless connected

// css
//  big white font
//  big bar on top
//  small gray sender / time
