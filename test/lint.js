const fs = require('fs');
const path = require('path');

const Ajv = require('ajv');
const betterAjvErrors = require('better-ajv-errors');
const {default: ora} = require('ora');

/** @type {Map<string, string>} */
const filesWithErrors = new Map();
const ajv = new Ajv({
  $data: true,
  allErrors: true,
  jsonPointers: true
});

const dictPaths = ['api', 'css', 'l10n'];

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

/**
 * @param {string} str
 */
function escapeInvisibles(str) {
  const invisibles = [
    ['\b', '\\b'],
    ['\f', '\\f'],
    ['\n', '\\n'],
    ['\r', '\\r'],
    ['\v', '\\v'],
    ['\t', '\\t'],
    ['\0', '\\0'],
  ];
  let finalString = str;

  invisibles.forEach(([invisible, replacement]) => {
    if (finalString.includes(invisible))
      finalString = finalString.split(invisible).join(replacement);
  });

  return finalString;
}

/**
 * @param {string} actual
 * @param {string} expected
 */
function jsonDiff(actual, expected) {
  var actualLines = actual.split(/\n/);
  var expectedLines = expected.split(/\n/);

  for (var i = 0; i < actualLines.length; i++) {
    if (actualLines[i] !== expectedLines[i]) {
      return [
        '#' + i,
        '    Actual:   ' + escapeInvisibles(actualLines[i]),
        '    Expected: ' + escapeInvisibles(expectedLines[i]),
      ].join('\n');
    }
  }
}

/**
 * @param {string} filename
 */
function testStyle(filename) {
  var actual = fs.readFileSync(filename, 'utf-8').trim();
  var expected = JSON.stringify(JSON.parse(actual), null, 2);

  if (actual === expected) {
    return false;
  } else {
    console.error(`\x1b[31m  Style – Error on line ${jsonDiff(actual, expected)}\x1b[0m`);
    return true;
  }
}

/**
 * @param {string} dataFilename
 */
function testSchema(dataFilename) {
  var schemaFilename = dataFilename.replace(/\.json/i, '.schema.json');

  if (fs.existsSync(schemaFilename)) {
    var schema = require(schemaFilename);
    var data = require(dataFilename);
    var valid = ajv.validate(schema, data);

    if (valid) {
      return false;
    } else {
      console.error(`\x1b[31m  JSON Schema – ${ajv.errors.length} error(s)\x1b[0m`)
      // Output messages by one since better-ajv-errors wrongly joins messages
      // (see https://github.com/atlassian/better-ajv-errors/pull/21)
      // Other issues with better-ajv-errors:
      // - it feels better for performance to output messages one by one rather than a list
      // - it seems to be losing some errors when output a list
      ajv.errors.forEach(e => {
        console.error(betterAjvErrors(schema, data, [e], {indent: 2}));
      });
      return true;
    }
  }
}

const hasErrors = dictPaths.reduce((hasErrors, dir) => {
  const absDir = path.resolve(path.join(__dirname, '..', dir));

  return fs.readdirSync(absDir).reduce((hasErrors, filename) => {
    if (path.extname(filename) === '.json') {
      let hasSyntaxErrors = false,
        hasSchemaErrors = false,
        hasStyleErrors = false;

      const absFilename = path.join(absDir, filename);
      const relativeFilePath = path.relative(process.cwd(), absFilename);

      const spinner = ora({
        stream: process.stdout,
        text: relativeFilePath
      });

      const console_error = console.error;
      console.error = (...args) => {
        spinner.stream = process.stderr;
        spinner.fail(relativeFilePath);
        console.error = console_error;
        console.error(...args);
      }

      try {
        hasStyleErrors = testStyle(absFilename)
        hasSchemaErrors = testSchema(absFilename);
      } catch (e) {
        hasSyntaxErrors = true;
        console.error(e);
      }

      if (hasSyntaxErrors || hasSchemaErrors || hasStyleErrors) {
        hasErrors = true;
        filesWithErrors.set(relativeFilePath, absFilename);
      } else {
        console.error = console_error;
        spinner.succeed();
      }
    }
    return hasErrors;
  }, /** @type {boolean} */ (false)) || hasErrors;
}, false);

if (hasErrors) {
  console.warn("");
  console.warn(`Problems in ${filesWithErrors.size} file${filesWithErrors.size > 1 ? 's' : ''}:`);
  for (const [fileName, file] of filesWithErrors) {
    console.warn(fileName);
    try {
      testSchema(file);
      testStyle(file);
    } catch (e) {
      console.error(e);
    }
  }
  process.exit(1);
}
