var fs = require('fs')
var path = require('path')
var checkStyle = require('./lint/checkStyle')
var checkSchema = require('./lint/checkSchema')

var dictPaths = ['api', 'css', 'l10n']
var noErrors = true

dictPaths.forEach(function (dir) {
  var absDir = path.resolve(path.join(__dirname, '..', dir))

  fs.readdirSync(absDir).forEach(function (filename) {
    if (path.extname(filename) === '.json') {
      var absFilename = path.join(absDir, filename)

      console.log(dir + '/' + filename)

      noErrors = noErrors && checkStyle(absFilename) && checkSchema(absFilename)
    }
  })
})

if (!noErrors) {
  console.log('Linting failed')
  process.exit(1)
}
