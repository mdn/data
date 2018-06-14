var properties = require('../css/properties');
var syntaxes = require('../css/syntaxes');
var basicTypes = require('../css/types');
var parseGrammar = require('css-tree').grammar.parse;

var hasErrors = false;
var itemsHaveErrors;

function isBasicType(name) { return basicTypes.hasOwnProperty(name); }
function isSyntax(name) { return syntaxes.hasOwnProperty(name); }
function isProperty(name) { return properties.hasOwnProperty(name); }

function validateGrammar(grammar, searchInProperties) {
    switch (grammar.type) {
    case 'Group':
      return grammar.terms
        .map(function(t) { return validateGrammar(t, searchInProperties); })
        .reduce(function(a, b) { return a.concat(b); }, []);
    case 'Multiplier':
      return validateGrammar(grammar.term, searchInProperties);
    case 'Type':
      var typeName = grammar.name;
      if (!(isBasicType(typeName) || isSyntax(typeName) || searchInProperties && isProperty(typeName))) {
          return [typeName];
      }
      return [];
    default:
      return [];
  }
}

function validateItem(name, item, searchInProperties) {
  try {
    var syntax = parseGrammar(item.syntax);
    var errs = validateGrammar(syntax, searchInProperties);
    if (errs.length > 0) {
      console.log('  ' + name + ':');
      errs.forEach(function (type) { console.log('    invalid type: ' + type); });
      itemsHaveErrors = true;
    }
  }
  catch (err) {
    console.log('  ' + name + ':');
    console.log('    ' + err.message.replace(/\n/g, '\n    '));
    itemsHaveErrors = true;
  }
}

function validateItems(file, items, searchInProperties) {
  console.log(file);

  itemsHaveErrors = false;

  Object.keys(items).forEach(function(key) { validateItem(key, items[key], searchInProperties); });

  if (itemsHaveErrors) {
    console.log('');
    hasErrors = true;
  }
  else {
    console.log('  Syntaxes – OK');
  }
}

validateItems('css/properties.json', properties, true);
validateItems('css/syntaxes.json', syntaxes, false);

if (hasErrors) {
  process.exit(1);
}
