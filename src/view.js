var hyperx = require('hyperx')
var vdom = require('virtual-dom')
var hyperx = require('hyperx')
var hx = hyperx(vdom.h)
var moment = require('moment')

var colors = [
  '#a00',
  '#0a0',
  '#00a',
]

function message (m) {
  let readableTime = moment(m.timestamp*1000).fromNow()
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
  <div> ${readableTime} </div>
  <div> ${m.message} </div>
</div>
</div>`
}

function render (api, state) {

  /*
    Error stuff
    */

  let errorLis = state.errors.map(e => hx`<li>${e}</li>`)

  let errors =
  hx`<div>
      <ul>${errorLis}</ul>
      <button onclick=${api.clearErrors}>x</button>
  </div>`


  /* Doodads & utils */
  let users = Object.keys(state.online)
      .map(function (user) {
        return hx`<div
           style="color: ${state.online[user]};">
            ${user}
          </div>`
      })

  let currentlyOnline =
      users.length ?
        hx`<div>Online: ${users}</div>`
      :
        hx`<div>No one currently online.</div>`

  let loading =
      hx`<div>loading...</div>`


  /*
    Join room stuff
    */

  function colorButton (c) {
    return hx`<div
        style="width: 20px; height: 20px;
        background-color:${c};
        ${ state.colorChoice === c  ?  "border: 2px solid #eee;" : "" }
      "
      onclick=${() => api.setColorChoice(c)}>
      </div>`
  }
  let colorPicker =
      hx`<div>
      ${colors.map(colorButton)}
    </div>`

  let join =
  hx`<div>
    <button onclick=${api.join}
            ${(state.joining || !state.connected) ? 'disabled' : ''}>
      join</button>
    ${colorPicker}
    <input oninput=${api.setPseudoInput}
           value=${state.pseudoInput}>
  </div>`


  /*
    Room view stuff
    */

  let input =
  hx`<div>
    <button onclick=${api.sendMessageInput}
            ${(state.sendingMessageInput || !state.connected) ? 'disabled' : ''}>
      send</button>
    <input id="messageInput"
           onchange=${api.setMessageInput}
           value=${state.messageInput}>
  </div>`


  let displayedMessages = state.messages.map(message)

  let messages =
    hx`<div>
${ state.messagesLoading ?
  loading
  :
  state.messages.length ?
    displayedMessages
    :
    "No messages!"
}
</div>`

  let leaveRoom =
    hx`<button
       onclick=${api.leave}
       ${(state.leavingRoom || !state.connected) ? 'disabled' : ''}>
    >leave room</button>`

  let room =
    hx`<div>
      ${leaveRoom}
      ${input}
      ${messages}
    </div>`


  let offlineNotice =
    hx`<div>
      Currently offline. Reconnecting.....
    </div>`

  /*
    Set keybindings
    */

  // HACK
  // set timeout to "assure" that DOM will be written by the time we bind...
  setTimeout(function () {
    let input = document.getElementById("messageInput")
    // if we have a user, are in the room,
    if (state.currentUser) {
      // set input box to focus
      input.focus()
      // bind enter key to send
      document.onkeypress = e => {
        if (e.which == 13) {
          // HACK
          // on enter we unfocus to "make sure" text is picked up
          input.blur()
          // then send,
          api.sendMessageInput()
          // then refocus,
          input.focus()
        }
      }
      // if we are not in the room,
    } else {
      // make sure that keypress is bound to nothing.
      document.onkeypress = e => { }
    }
  }, 300)

  return hx`<div>
    ${ !state.connected ? offlineNotice : "" }
    ${ state.errors.length ? errors : '' }
    ${ currentlyOnline }
    ${ state.currentUser ? room : join }
  </div>`
}

module.exports = render
