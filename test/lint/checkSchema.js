const fs = require('fs')
const Ajv = require('ajv')
const ajv = new Ajv({ $data: true, allErrors: true })

const definitions = require('../../css/definitions.json')
const properties = require('../../css/properties.json')

ajv.addSchema(definitions, 'definitions')
ajv.addSchema({ names: { enum: Object.keys(properties) } }, 'properties')

function checkSchema (dataFilename) {
  let noErrors = true
  const schemaFilename = dataFilename.replace(/\.json/i, '.schema.json')

  if (fs.existsSync(schemaFilename)) {
    const valid = ajv.validate(
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
