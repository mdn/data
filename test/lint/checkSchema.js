var fs = require('fs')
var Ajv = require('ajv')
var ajv = new Ajv({ $data: true, allErrors: true })

var definitions = require('../../css/definitions.json')
var properties = require('../../css/properties.json')

ajv.addSchema(definitions, 'definitions')
ajv.addSchema({ names: { type: 'string', enum: Object.keys(properties) } }, 'properties')

function checkSchema (dataFilename) {
  var noErrors = true
  var schemaFilename = dataFilename.replace(/\.json/i, '.schema.json')

  if (fs.existsSync(schemaFilename)) {
    var valid = ajv.validate(
      require(schemaFilename),
      require(dataFilename)
    )

    if (valid) {
      console.log('  JSON Schema – OK')
    } else {
      noErrors = false
      console.log('  JSON Schema – ' + ajv.errors.length + ' error(s)\n    ' +
        ajv.errorsText(ajv.errors, {
          separator: '\n    ',
          dataVar: 'item'
        })
      )
    }
  }

  return noErrors
}

module.exports = checkSchema
