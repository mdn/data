var properties = require('../css/properties');
var syntaxes = require('../css/syntaxes');
var basicTypes = require('../css/types');
var parseGrammar = require('css-tree').grammar.parse;

var hasErrors = false;
var itemsHaveErrors;

function isBasicType(name) { return basicTypes.hasOwnProperty(name); }
function isSyntax(name) { return syntaxes.hasOwnProperty(name); }
function isProperty(name) { return properties.hasOwnProperty(name); }

// Checks that the syntaxes this grammar refers to exist.
// Returns an array of errors (strings), one for each broken reference.
function validateGrammar(grammar) {
  switch (grammar.type) {
    case 'Group':
      // validate the nested grammars and collect all the errors
      return grammar.terms
        .map(validateGrammar)
        .reduce(function(a, b) { return a.concat(b); }, []);
    case 'Multiplier':
      // validate the nested grammar
      return validateGrammar(grammar.term);
    case 'Type':
      // validate basic types and non-terminal types, e.g. <length>, <bg-image>
      var typeName = grammar.name;
      if (!(isBasicType(typeName) || isSyntax(typeName))) {
        return ['invalid type: ' + typeName];
      }
      return [];
    case 'Property':
      // validate references to properties, e.g. <'background-color'>
      var typeName = grammar.name;
      if (!isProperty(typeName)) {
        return ['invalid property: ' + typeName];
      }
      return [];
    default:
      return [];
  }
}

function validateItem(name, item) {
  try {
    var syntax = parseGrammar(item.syntax);
    var errs = validateGrammar(syntax);
    if (errs.length > 0) {
      // print validation errors
      console.log('  ' + name + ':');
      errs.forEach(function (err) { console.log('    ' + err); });
      itemsHaveErrors = true;
    }
  }
  catch (err) {
    // print parsing errors
    console.log('  ' + name + ':');
    console.log('    ' + err.message.replace(/\n/g, '\n    '));
    itemsHaveErrors = true;
  }
}

function validateItems(file, items) {
  console.log(file);

  itemsHaveErrors = false;

  Object.keys(items).forEach(function(key) { validateItem(key, items[key]); });

  if (itemsHaveErrors) {
    console.log('');
    hasErrors = true;
  }
  else {
    console.log('  Syntaxes – OK');
  }
}

validateItems('css/properties.json', properties);
validateItems('css/syntaxes.json', syntaxes);

if (hasErrors) {
  process.exit(1);
}
