const isHex = require('is-hex-color')

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
      'Pseudonym must be a string',
    ],
    [
      (p.length < 1 || p.length > 24),
      'Pseuodnym must be between 1 and 24 characters',
    ],
  ]
  return validate(checks)
}

// String -> Union[Boolean, String]
function hexColor (p) {
  const checks = [
    [
      typeof(p) !== 'string',
      'Hex color must be a string'
    ],
    [
      !isHex(p),
      'Not a valid hex color'
    ]
  ]
  return validate(checks)
}


module.exports = {
  pseudonym: pseudonym,
  hexColor: hexColor
}
