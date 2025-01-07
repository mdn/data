# MDN data contribution guide

Thanks for taking the time to contribute to [MDN Web Docs](https://developer.mozilla.org)! :tada:
This file lists some general guidelines to help you contribute effectively.

## Publishing a release

Details about publishing a release can be found in the [publishing guide](./docs/publishing.md).

## Types of contribution

There are many ways you can help improve this repository! For example:

### General tasks

- **Fixing a bug:** we have a list of [issues](https://github.com/mdn/data/issues),
  or maybe you found your own.
- **Reviewing a pull request:** there is a list of [PRs](https://github.com/mdn/data/pulls).
  Let us know if these look good to you.
- **Localizing strings:** translations are in the [l10n folder](./l10n). You can add your locale.

**Note**: Commits need to adhere to [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) and only `fix:` and `feat:` commits are considered.

### CSS data tasks

- **Updating CSS data**: familiarize yourself with the [CSS schema files](./css/README.md) and add missing CSS data. An additional guide is provided in the [How to update the CSS JSON DB](./docs/updating_css_json.md) document.

## Validating the data

You can use `npm test` to validate data against the schema. You might need to install the devDependencies using `npm install --dev`.

## Reviewer's checklist

Not everything is enforced or validated by the schema. A few things a reviewer should pay attention to:

- Make sure `npm test` reports no errors.
- Double check the data using the latest specifications.

## Code style

The JSON files should be formatted according to the [.editorconfig](.editorconfig) file.

## Licensing

Please note that the compatibility data is made available under the
[CC0 1.0 Universal (public domain) license](LICENSE),
so any contributions must be compatible with that license. If you're not sure about that, just ask.

## Getting help

If you need help with this repository or have any questions, contact the MDN team
in the [#mdn](irc://irc.mozilla.org/mdn) IRC channel on irc.mozilla.org or write us on [discourse](https://discourse.mozilla-community.org/c/mdn).
