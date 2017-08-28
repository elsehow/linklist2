const isHex = require('is-hex-color')

const messages = {

  'HEX_INVALID': 'Not a valid hex color',
  'HEX_NOT_STRING': 'Please choose a color',

  'PSEUDO_BAD_LENGTH': 'Pseuodnym must be between 1 and 24 characters',
  'PSEDUO_NOT_STRING': 'Pseudonym must be a string',

  'JOIN_ALREADY_JOINED': 'You have already joined the room',
  'JOIN_PSEUDO_TAKEN': 'That pseudonym is already taken in this room',

  'LEAVE_HAVE_NOT_JOINED': 'You cannot leave if you have not joined',

  'MESSAGE_CANNOT_BE_EMPTY': 'Cannot send an empty message',
  'MESSAGE_TOO_LONG': 'Message must be fewer than 1000 characters',
  'MESSAGE_NOT_STRING': 'Messages must be a string',
  'MESSAGE_TIMESTAMP_NOT_NUMBER': 'Message timestamp must be a number',
  'MESSAGE_MUST_HAVE_MESSAGE': 'Message must have a `message` field',
  'MESSAGE_MUST_HAVE_PSEUDO': 'Message must have a `pseudo` field',
  'MESSAGE_MUST_HAVE_TIMESTAMP': 'Message must have a `timestamp` field',
  'POSTACTION_SENDER_NOT_JOINED': 'Must join room to send a message',
}

// List[[Boolean, String]] -> Union[Boolean, String]
function validate (checks) {
  for (check of checks) {
    let [errorCase, errorMsg] = check
    if (errorCase)
      return errorMsg
  }
  return false
}

// String -> Union[Boolean, String]
function pseudonym (p) {
  return validate([
    [
      typeof(p) !== 'string',
      messages['PSEUDO_NOT_STRING']
    ],
    [
      (p.length < 1 || p.length > 24),
      messages['PSEUDO_BAD_LENGTH']
    ],
  ])
}

// String -> Union[Boolean, String]
function hexColor (p) {
  return validate([
    [
      typeof(p) !== 'string',
      messages['HEX_NOT_STRING']
    ],
    [
      !isHex(p),
      messages['HEX_INVALID']
    ]
  ])
}

// SocketClient, Object[String->String], String -> Union[Boolean, String]
function join (socketClient, onlineMap, pseudo) {
  return validate([
    [
      socketClient.online,
      messages['JOIN_ALREADY_JOINED']
    ],
    [
      onlineMap[pseudo],
      messages['JOIN_PSEUDO_TAKEN']
    ],
  ])
}

// SocketClient -> Union[Boolean, String]
function leave (socketClient) {
  return validate([
    [
      !socketClient.online,
      messages['LEAVE_HAVE_NOT_JOINED']
    ]
  ])
}

function message (m) {
  try {
    return validate([
      [
        !m.message,
        messages['MESSAGE_CANNOT_BE_EMPTY']
      ],
      [
        !m.pseudo,
        messages['MESSAGE_MUST_HAVE_PSEUDO']
      ],
      [
        !m.timestamp,
        messages['MESSAGE_MUST_HAVE_TIMESTAMP']
      ],
      [
        !typeof(m.message) === 'string',
        messages['MESSAGE_NOT_STRING'],
      ],
      [
        !typeof(m.pseudonym) === 'string',
        messages['PSEUDO_NOT_STRING'],
      ],
      [
        !typeof(m.timestamp) === 'number',
        messages['MESSAGE_TIMESTAMP_NOT_NUMBER'],
      ],
      [
        m.message.length == 0,
        messages['MESSAGE_CANNOT_BE_EMPTY']
      ],
      [
        m.message.length > 1000,
        messages['MESSAGE_TOO_LONG']
      ],
    ])
  } catch (err) {
    return err
  }
}

function postAction (pseudo, onlineMap) {
  return validate([
    [
      !onlineMap[pseudo],
      messages['POSTACTION_SENDER_NOT_JOINED']
    ],
  ])
}

module.exports = {
  pseudonym: pseudonym,
  hexColor: hexColor,
  messages: messages,
  join: join,
  leave: leave,
  message: message,
  postAction: postAction,
}
