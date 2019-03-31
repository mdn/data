We're really happy to accept contributions to the mdn-data repository!
This file lists some general guidelines to help you contributing effectively.

## Types of contribution

There are many ways you can help improve this repository! For example:

### General tasks
* **Fixing a bug:** we have a list of [issues](https://github.com/mdn/data/issues),
or maybe you found your own.
* **Reviewing a pull request:** there is a list of [PRs](https://github.com/mdn/data/pulls).
Let us know if these look good to you.
* **Localizing strings:** translations are in the [l10n folder](https://github.com/mdn/data/blob/master/l10n). You can add your locale.

### CSS data tasks
* **Adding new CSS data**: familiarize yourself with the [CSS schema files](https://github.com/mdn/data/blob/master/css/readme.md) and add missing CSS data.


## Validating the data
You can use `npm test` to validate data against the schema. You might need to install the devDependencies using `npm install --dev`.

## Reviewer's checklist
Not everything is enforced or validated by the schema. A few things a reviewer should pay attention to:

* Make sure `npm test` (or travis) reports no errors.
* Double check the data using the latest specifications.


## Code style

The JSON files should be formatted according to the [.editorconfig](https://github.com/mdn/data/blob/master/.editorconfig) file.

## Licensing

Please note that the compatibility data is made available under the
[CC0 1.0 Universal (public domain) license](https://github.com/mdn/data/blob/master/LICENSE),
so any contributions must be compatible with that license. If you're not sure about that, just ask.

## Getting help

If you need help with this repository or have any questions, contact the MDN team
in the [#mdn](irc://irc.mozilla.org/mdn) IRC channel on irc.mozilla.org or write us on [discourse](https://discourse.mozilla-community.org/c/mdn).
