var properties = require('../css/properties');
var syntaxes = require('../css/syntaxes');
var basicTypes = require('../css/types');
var parseGrammar = require('css-tree').grammar.parse;
var walkGrammar = require('css-tree').grammar.walk;

var hasErrors = false;

function isBasicType(name) { return basicTypes.hasOwnProperty(name); }
function isSyntax(name) { return syntaxes.hasOwnProperty(name); }
function isProperty(name) { return properties.hasOwnProperty(name); }

// Checks that the syntaxes this grammar refers to exist.
// Returns an array of errors (strings), one for each broken reference.
function validateGrammar(grammar) {
  var errors = [];

  walkGrammar(grammar, function(node) {
    switch (node.type) {
      case 'Type':
        // validate basic types and non-terminal types, e.g. <length>, <bg-image>
        var typeName = node.name;
        if (!isBasicType(typeName) && !isSyntax(typeName)) {
          errors.push('Broken reference: <' + typeName + '>');
        }
        break;

      case 'Property':
        // validate references to properties, e.g. <'background-color'>
        var typeName = node.name;
        if (!isProperty(typeName)) {
          errors.push('Broken reference: <\'' + typeName + '\'>');
        }
        break;
    }
  });

  return errors;
}

function validateItem(name, item) {
  try {
    var syntax = parseGrammar(item.syntax);
    var errors = validateGrammar(syntax);
    if (errors.length > 0) {
      // print validation errors
      console.log('  ' + name + ':');
      console.log('    ' + errors.join('\n    '));
      return false;
    }
  } catch (err) {
    // print parsing errors
    console.log('  ' + name + ':');
    console.log('    ' + err.message.replace(/\n/g, '\n    '));
    return false;
  }
}

function validateItems(file, items) {
  console.log(file);

  var itemsHaveErrors = false;

  for (var key in items) {
    if (!validateItem(key, items[key])) {
      itemsHaveErrors = true;
    }
  }

  if (itemsHaveErrors) {
    hasErrors = true;
  } else {
    console.log('  Syntaxes – OK');
  }
}

validateItems('css/properties.json', properties);
validateItems('css/syntaxes.json', syntaxes);

if (hasErrors) {
  process.exit(1);
}
