# Publishing a new version of MDN `mdn-data`

Repo admins publish new releases of [mdn-data](https://www.npmjs.com/package/mdn-data) on npm. This is then used by MDN to generate various sidebars as well as other things.

Any admin can complete the following steps to publish a new version, but please coordinate releases with [@ddbeck](https://github.com/ddbeck) or [@Rumyra](https://github.com/Rumyra).

The steps in this process assume:

- `NPM_TOKEN` is set in the repository secrets. If the token is invalidated or unset, a member of the `@mdn` organization on npm must [create a new token](https://docs.npmjs.com/creating-and-viewing-authentication-tokens) and [add it to the repository's secrets](https://docs.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets#creating-encrypted-secrets-for-a-repository).

## Publish to npm

1. Start a draft [release on GitHub](https://github.com/mdn/data/releases).

   - In the _Tag version_ and _Release title_ fields, enter `vX.Y.Z` where `X.Y.Z` is the version number you'd like to publish. Do not use an existing value, but instead
   select an increment from the previous release. For example, if the previous release
   was `v2.0.20`, use `v2.0.21` for the _Tag version_ and _Release title_ fields.
   - You can leave the _Describe this release_ field blank, or add notes as you wish.

   _Note_: If you're not ready to publish to npm, click **Save draft** in GitHub and resume this process later.

2. Click **Publish release** to create the tag and trigger the workflow that publishes to npm. Wait for the release [GitHub Actions workflow](https://github.com/mdn/data/actions) to finish successfully.

3. Check [`mdn-data` on npm](https://www.npmjs.com/package/mdn-data) to see if the release shows up correctly.

The package is now published. 🎉
