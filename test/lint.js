const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const csstree = require('css-tree');
const betterAjvErrors = require('better-ajv-errors').default;
const dictPaths = ['api', 'css', 'l10n'];
const lintSyntaxPaths = [
  'css/at-rules.json',
  'css/properties.json',
  'css/selectors.json',
  'css/syntaxes.json'
];
const ignoreSyntaxes = new Set([
  '@charset',
  'ID selectors',
  'Universal selectors',
  'Adjacent sibling combinator',
  '::after',
  '::before',
  '::first-letter',
  '::first-line'
]);
const syntaxConnectivityCheck = [];
const cssProperties = new Set();
const cssTypes = new Set(Object.keys(new csstree.Lexer({ generic: true }).types));
let hasErrors = false;
const ajv = new Ajv({
  $data: true,
  allErrors: true,
  jsonPointers: true
});

ajv.addKeyword('property-reference', {
  $data: true,
  metaSchema: { type: 'object' },
  validate(schema, data, parentSchema) {
    const valid = schema.hasOwnProperty(data);
    if (!valid) {
      // TODO: make a verbose message when invalid
      // throw new Error('wrong reference')
    }
    return valid;
  }
});

ajv.addSchema(require('../css/definitions.json'), 'definitions.json');

function indentErrorOutput(output) {
  return output.replace(/^|\n/g, '\n    ');
}

function jsonDiff(actual, expected) {
  const actualLines = actual.split(/\n/);
  const expectedLines = expected.split(/\n/);

  for (let i = 0; i < actualLines.length; i++) {
    if (actualLines[i] !== expectedLines[i]) {
      return [
        '#' + i,
        '  Actual:   |' + actualLines[i],
        '  Expected: |' + expectedLines[i]
      ].join('\n') + '\n';
    }
  }
}

function checkStyle({ text, data }) {
  const actual = text.trim();
  const expected = JSON.stringify(data, null, 2);

  if (actual === expected) {
    console.log('  Style – OK');
  } else {
    hasErrors = true;
    console.log('  Style – Failed')
    console.log(indentErrorOutput('Error on line ' + jsonDiff(actual, expected)));
  }
}

function checkSchema({ filename, data }) {
  const schemaFilename = filename.replace(/\.json/i, '.schema.json');

  if (fs.existsSync(schemaFilename)) {
    const schema = require(schemaFilename);
    const valid = ajv.validate(schema, data);

    if (valid) {
      console.log('  JSON Schema – OK');
    } else {
      hasErrors = true;
      console.log(`  JSON Schema – Failed with ${ajv.errors.length} error(s)`)
      console.log(indentErrorOutput(betterAjvErrors(schema, data, ajv.errors, { indent: 2 })));
    }
  }
}

function checkSyntaxDefinition({ filename, data: dict }) {
  const basename = path.basename(filename, '.json');
  const errors = [];
  
  for (const [key, { syntax, descriptors }] of Object.entries(dict)) {
    if (ignoreSyntaxes.has(key)) {
      continue;
    }

    try {
      if (key.startsWith('@')) {
        const prelude = syntax.trim().replace(/\{(.|\s)+\}/, '').match(/^@\S+\s+([^;\{]*)/)[1].trim() || null;

        if (prelude) {
          syntaxConnectivityCheck.push({
            path: `css/${basename}.json "${key}" prelude`,
            ast: csstree.definitionSyntax.parse(prelude)
          });
        }
      } else {
        switch (basename) {
          case 'properties':
            cssProperties.add(key);
            break;
          case 'syntaxes':
            cssTypes.add(key);
            break;
        }

        syntaxConnectivityCheck.push({
          path: `css/${basename}.json "${key}"`,
          ast: csstree.definitionSyntax.parse(syntax)
        });
      }
    } catch(error) {
      errors.push({ ref: key, error });
    }

    if (descriptors) {
      for (const [descriptorName, { syntax }] of Object.entries(descriptors)) {
        try {
          syntaxConnectivityCheck.push({
            path: `css/${basename}.json "${key}/${descriptorName}"`,
            ast: csstree.definitionSyntax.parse(syntax)
          });
        } catch(error) {
          errors.push({ ref: `${key}/${descriptorName}`, error });
        }
      }
    }
  }

  if (errors.length === 0) {
    console.log('  Definition syntax check - OK');
  } else {
    hasErrors = true;
    console.log(`  Definition syntax check - Failed with ${errors.length} error(s)`);
    for (const { ref, error } of errors) {
      console.log(indentErrorOutput(`Parse error of "${ref}": ${error.message}`));
    }
  }
}

for (const dir of dictPaths) {
  const absDir = path.resolve(path.join(__dirname, '..', dir));

  for (const filename of fs.readdirSync(absDir)) {
    if (path.extname(filename) === '.json') {
      const relFilename = path.join(dir, filename);
      const absFilename = path.join(absDir, filename);
      const text = fs.readFileSync(absFilename, 'utf8');
      const file = {
        filename: absFilename,
        text,
        data: JSON.parse(text)
      };

      console.log(relFilename);

      checkStyle(file);

      if (!absFilename.endsWith('.schema.json')) {
        checkSchema(file);

        if (lintSyntaxPaths.includes(relFilename)) {
          checkSyntaxDefinition(file);
        }
      }

      console.log();
    }
  }
}

console.log('Check CSS syntax connectivity...');
let hasSyntaxReferenceErrors = false;
for (const { path, ast } of syntaxConnectivityCheck) {
  csstree.definitionSyntax.walk(ast, (node) => {
    if (node.type === 'Type' && !cssTypes.has(node.name)) {
      hasSyntaxReferenceErrors = hasErrors = true;
      console.log(`  ${path} used missed syntax definition <${node.name}>`);
    }
    if (node.type === 'Property' && !cssProperties.has(node.name)) {
      hasSyntaxReferenceErrors = hasErrors = true;
      console.log(`  ${path} used missed syntax definition <'${node.name}'>`);
    }
  });
}
if (!hasSyntaxReferenceErrors) {
  console.log('  OK – no broken references');
}
console.log();

if (hasErrors) {
  console.log('Lint check FAILED');
  process.exit(1);
}

console.log('Lint check PASSED');
