var fs = require('fs')
var jsonDiff = require('./jsonDiff')

function checkStyle (filename) {
  var noErrors = true
  var actual = fs.readFileSync(filename, 'utf-8').trim()
  var expected = JSON.stringify(JSON.parse(actual), null, 2)

  if (actual === expected) {
    console.log('  Style – OK')
  } else {
    noErrors = false
    console.log('  Style – Error on line ' + jsonDiff(actual, expected))
  }

  return noErrors
}

module.exports = checkStyle
