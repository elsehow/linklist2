const isHex = require('is-hex-color')

const messages = {
  'HEX_INVALID': 'Not a valid hex color',
  'HEX_NOT_STRING': 'Hex color must be a string',
  'PSEUDO_BAD_LENGTH': 'Pseuodnym must be between 1 and 24 characters',
  'PSEDUO_NOT_STRING': 'Pseudonym must be a string',
  'JOIN_ALREADY_JOINED': 'You have already joined the room',
  'JOIN_PSEUDO_TAKEN': 'That pseudonym is already taken in this room',
  'LEAVE_HAVE_NOT_JOINED': 'You cannot leave if you have not joined',
  'MESSAGE_CANNOT_BE_EMPTY': 'Cannot send an empty message',
  'MESSAGE_TOO_LONG': 'Message must be fewer than 1000 characters',
  'MESSAGE_NOT_STRING': 'Messages must be a string',
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
  const checks = [
    [
      typeof(p) !== 'string',
      messages['PSEUDO_NOT_STRING']
    ],
    [
      (p.length < 1 || p.length > 24),
      messages['PSEUDO_BAD_LENGTH']
    ],
  ]
  return validate(checks)
}

// String -> Union[Boolean, String]
function hexColor (p) {
  const checks = [
    [
      typeof(p) !== 'string',
      messages['HEX_NOT_STRING']
    ],
    [
      !isHex(p),
      messages['HEX_INVALID']
    ]
  ]
  return validate(checks)
}

// SocketClient, Object[String->String], String -> Union[Boolean, String]
function join (socketClient, onlineMap, pseudo) {
  const checks = [
    [
      socketClient.online,
      messages['JOIN_ALREADY_JOINED']
    ],
    [
      onlineMap[pseudo],
      messages['JOIN_PSEUDO_TAKEN']
    ],
  ]
  return validate(checks)
}

// SocketClient -> Union[Boolean, String]
function leave (socketClient) {
  const checks = [
    [
      !socketClient.online,
      messages['LEAVE_HAVE_NOT_JOINED']
    ]
  ]
  return validate(checks)
}

function message (m) {
  const checks = [
    [
      !typeof(m) === 'string',
      messages['MESSAGE_NOT_STRING'],
    ],
    [
      m.length == 0,
      messages['MESSAGE_CANNOT_BE_EMPTY']
    ],
    [
      m.length > 1000,
      messages['MESSAGE_TOO_LONG']
    ],
  ]
  return validate(checks)
}

module.exports = {
  pseudonym: pseudonym,
  hexColor: hexColor,
  messages: messages,
  join: join,
  leave: leave,
  message: message,
}
