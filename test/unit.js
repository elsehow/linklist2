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
    'Pseudonym must be a string',
    '6 is not ok'
  )
  t.deepEquals(
    validators.pseudonym(['myname']),
    'Pseudonym must be a string',
    '[myname] is not ok',
  )
  t.deepEquals(
    validators.pseudonym(''),
    'Psueodnym must be between 1 and 24 characters',
    "'' is not ok"
  )
  t.deepEquals(
    validators.pseudonym('my realy really long pseudonym gosh'),
    'Psueodnym must be between 1 and 24 characters',
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
    'Not a valid hex color',
    "'sup' is not a color"
  )
  t.deepEquals(
    validators.hexColor("eee"),
    'Not a valid hex color',
    "'eee' is not a color"
  )
  // non-strings
  t.deepEquals(
    validators.hexColor(2323),
    'Hex color must be a string',
  )
  t.deepEquals(
    validators.hexColor(["#333"]),
    'Hex color must be a string',
    "['#333'] is not a color"
  )
  t.deepEquals(
    validators.hexColor(["#333", "#433"]),
    'Hex color must be a string',
    "['#333', '#433'] is not a color"
  )
  t.end()
})
