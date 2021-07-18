#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const betterAjvErrors = require('better-ajv-errors');

const root = path.resolve(__dirname, '..');
const customStyle = [
  'api/group-data',
];
const dictPaths = ['api', 'css', 'l10n'];
var hasErrors = false;
var ajv = new Ajv({
  $data: true,
  allErrors: true,
  jsonPointers: true
});

ajv.addKeyword('property-reference', {
  $data: true,
  metaSchema: { type: 'object' },
  validate: function(schema, data, parentSchema) {
    var valid = schema.hasOwnProperty(data);
    if (!valid) {
      // TODO: make a verbose message when invalid
      // throw new Error('wrong reference')
    }
    return valid;
  }
});

ajv.addSchema(require('../css/definitions.json'), 'definitions.json');

function jsonDiff(actual, expected) {
  var actualLines = actual.split(/\n/);
  var expectedLines = expected.split(/\n/);

  for (var i = 0; i < actualLines.length; i++) {
    if (actualLines[i] !== expectedLines[i]) {
      return [
        '#' + i,
        '    Actual:   ' + actualLines[i],
        '    Expected: ' + expectedLines[i]
      ].join('\n');
    }
  }
}

function checkStyle(filename, relativeFilename) {
  if (customStyle.includes(relativeFilename.replace(/(?:\.schema)?\.json$/, ''))) {
    console.log('\x1b[36m  Style - Custom\x1b[0m');
    return;
  }

  var actual = fs.readFileSync(filename, 'utf-8').trim();
  var expected = JSON.stringify(JSON.parse(actual), null, 2);

  if (actual === expected) {
    console.log('\x1b[32m  Style – OK\x1b[0m');
  } else {
    hasErrors = true;
    console.log(`\x1b[31m  Style – Error on line ${jsonDiff(actual, expected)}\x1b[0m`);
  }
}

function checkSchema(dataFilename) {
  var schemaFilename = dataFilename.replace(/\.json$/i, '.schema.json');

  if (fs.existsSync(schemaFilename)) {
    var schema = require(schemaFilename);
    var data = require(dataFilename);
    var valid = ajv.validate(schema, data);

    if (valid) {
      console.log('\x1b[32m  JSON Schema – OK');
    } else {
      hasErrors = true;
      console.log('\x1b[31m  JSON Schema – ' + ajv.errors.length + ' error(s)')
      // console.log(betterAjvErrors(schema, data, ajv.errors, { indent: 2 }));

      // Output messages by one since better-ajv-errors wrongly joins messages
      // (see https://github.com/atlassian/better-ajv-errors/pull/21)
      // Other issues with better-ajv-errors:
      // - it feels better for performance to output messages one by one rather than a list
      // - it seems to be losing some errors when output a list
      ajv.errors.forEach(function(error) {
        var message = betterAjvErrors(schema, data, [error], { indent: 2 });

        console.log('\n    ' + message.replace(/\n/g, '\n    '));
      });
    }
  }
}

dictPaths.forEach(function(dir) {
  const absDir = path.resolve(root, dir);

  fs.readdirSync(absDir).forEach(function(filename) {
    if (path.extname(filename) === '.json') {
      const absFilename = path.join(absDir, filename);
      const relativeFilename = path.relative(root, absFilename).replace(/\\/g, '/');

      console.log(`\x1b[0m${dir}/${filename}`);

      checkStyle(absFilename, relativeFilename)
      checkSchema(absFilename);

      console.log('\x1b[0m');
    }
  });
});

if (hasErrors) {
  process.exit(1);
}
