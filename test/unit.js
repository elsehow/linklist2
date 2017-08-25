const test = require('tape')
const validators = require('..').validators

/*
  Validators
*/

test('psuedonym validator works', t => {
  t.deepEquals(
    validators.pseudonym('myname'),
    false,
    'myname is ok'
  )
  t.deepEquals(
    validators.pseudonym(6),
    validators.messages['PSEUDO_NOT_STRING'],
    '6 is not ok'
  )
  t.deepEquals(
    validators.pseudonym(['myname']),
    validators.messages['PSEUDO_NOT_STRING'],
    '[myname] is not ok',
  )
  t.deepEquals(
    validators.pseudonym(''),
    validators.messages['PSEUDO_BAD_LENGTH'],
    "'' is not ok"
  )
  t.deepEquals(
    validators.pseudonym('my realy really long pseudonym gosh'),
    validators.messages['PSEUDO_BAD_LENGTH'],
    "'my realy really long pseudonym gosh' is not ok"
  )
  t.end()
})


test('color validator works', t => {
  // valid examples
  t.deepEquals(
    validators.hexColor('#333'),
    false,
    '#333 is a color'
  )
  t.deepEquals(
    validators.hexColor('#eee'),
    false,
    '#eee is a color'
  )
  // invalid hex colors
  t.deepEquals(
    validators.hexColor('#303030'),
    false,
    '#303030 is a color'
  )
  t.deepEquals(
    validators.hexColor('sup'),
    validators.messages['HEX_INVALID'],
    "'sup' is not a color"
  )
  t.deepEquals(
    validators.hexColor("eee"),
    validators.messages['HEX_INVALID'],
    "'eee' is not a color"
  )
  t.deepEquals(
    validators.hexColor("#ggg"),
    validators.messages['HEX_INVALID'],
    "'#ggg' is not a color"
  )
  // non-strings
  t.deepEquals(
    validators.hexColor(2323),
    validators.messages['HEX_NOT_STRING'],
  )
  t.deepEquals(
    validators.hexColor(["#333"]),
    validators.messages['HEX_NOT_STRING'],
    "['#333'] is not a color"
  )
  t.deepEquals(
    validators.hexColor(["#333", "#433"]),
    validators.messages['HEX_NOT_STRING'],
    "['#333', '#433'] is not a color"
  )
  t.end()
})

test('message validator works', t => {
  t.deepEqual(
    validators.message(''),
    validators.messages['MESSAGE_CANNOT_BE_EMPTY'],
  )
  t.deepEqual(
    validators.message(Array(1002).join(',')),
    validators.messages['MESSAGE_TOO_LONG'],
  )
  t.end()
})

