var fs = require('fs');
var path = require('path');
var Ajv = require('ajv');
var ajv = new Ajv({ $data: true, allErrors: true });
var dictPaths = ['css'];
var hasErrors = false;

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

dictPaths.forEach(function(dir) {
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
});

if (hasErrors) {
    process.exit(1);
}
