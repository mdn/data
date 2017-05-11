var fs = require('fs');
var path = require('path');
var Ajv = require('ajv');
var ajv = new Ajv({ allErrors: true });
var dictPaths = ['css'];
var hasErrors = false;

function validateDir(dir) {
    var absDir = path.resolve(path.join(__dirname, '..', dir));

    fs.readdirSync(absDir).forEach(function(filename) {
        if (/\.schema\.json$/.test(filename)) {
            var dataFilename = filename.replace(/\.schema\.json$/, '.json');
            var absSchemaFilename = path.join(absDir, filename);
            var absDataFilename = path.join(absDir, dataFilename);
            var header = dir + '/' + dataFilename;

            var valid = ajv.validate(
                require(absSchemaFilename),
                require(absDataFilename)
            );

            if (valid) {
                console.log(header + ' - OK');
            } else {
                hasErrors = true;
                console.log(
                    header + ' errors:\n  ' +
                    ajv.errorsText(ajv.errors, {
                        separator: '\n  ',
                        dataVar: 'item'
                    })
                );
            }

            console.log();
        }
    });
}

dictPaths.forEach(validateDir);

if (hasErrors) {
    process.exit(1);
}
