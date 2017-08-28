var hyperx = require('hyperx')
var vdom = require('virtual-dom')
var hyperx = require('hyperx')
var hx = hyperx(vdom.h)
var moment = require('moment')

var colors = [
  '#a00',
  '#0a0',
  '#00a',
  '#aa0',
  '#0aa',
  '#aaa',
]

function message (m) {
  let readableTime = moment(m.timestamp*1000).fromNow()
  return hx`<div class="message-container" style="display: flex;" >
    <div
      class="message-color-bar"
      style="background-color: ${m.senderColor};
             align-items: stretch;
             align-content: stretch;">
    </div>
    <div class="message"
        style="flex-grow:1">
      <div class="message-meta">
        <div> ${m.pseudo} </div>
        <div> ${readableTime} </div>
      </div>
      <div class="message">
        ${m.message}
      </div>
    </div>
  </div>`
}

function render (api, state) {

  /*
    Error stuff
    */

  let errorLis = state.errors.map(e => hx`<li>${e}</li>`)

  let errors =
  hx`<div id="errors">
      <button onclick=${api.clearErrors}>x</button>
      <ul>${errorLis}</ul>
  </div>`


  /* Doodads & utils */
  let users = Object.keys(state.online)
      .map(function (user) {
        return hx`<div
           style="color: ${state.online[user]};"
           class="online-user" >
            ${user}
          </div>`
      })

  let currentlyOnline =
      users.length ?
        hx`<div id="onlineStatus">Online: ${users}</div>`
      :
        hx`<div id="onlineStatus">No one currently online.</div>`

  let loading =
      hx`<div>loading...</div>`


  /*
    Join room stuff
    */

  function colorButton (c) {
    return hx`<div
        class="color"
        style="background-color:${c};
               position:relative;
               ${ state.colorChoice === c  ?  "outline: 2px solid #eee; z-index:3000;" : "" }
      "
      onclick=${() => api.setColorChoice(c)}>
      </div>`
  }
  let colorPicker =
      hx`<div id="colorPicker">
      ${colors.map(colorButton)}
    </div>`

  let join =
  hx`<div id="joinScreen">
    <div class="upperRow">
      ${colorPicker}
      <input oninput=${api.setPseudoInput}
             placeholder="Enter a pseudonym"
             value=${state.pseudoInput}></input>
    </div>
    <div class="lowerRow">
      <button onclick=${api.join}
              ${(state.joining || !state.connected) ? 'disabled' : ''}>
        join</button>
    </div>
  </div>`


  /*
    Room view stuff
    */

  let input =
  hx`<div id="messageInputControls">
    <button id="submitMessageInputButton"
            onclick=${api.sendMessageInput}
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


  let offlineNotice =
      hx`<div>
      Currently offline. Reconnecting.....
    </div>`

  let roomStatus =
    hx`<div class="roomStatus">
      <button
         onclick=${api.leave}
         ${(state.leavingRoom || !state.connected) ? 'disabled' : ''}>
      leave room
      </button>
    </div>`

  let room =
    hx`<div>
      ${input}
      ${messages}
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
    ${ !state.connected ? offlineNotice : '' }
    ${ state.currentUser ? roomStatus : ''}
    ${ state.errors.length ? errors : '' }
    ${ currentlyOnline }
    ${ state.currentUser ? room : join }
  </div>`
}

module.exports = render
