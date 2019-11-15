# Publishing a new version of MDN `data`

Repo admins publish new releases of [data](https://www.npmjs.com/package/mdn-data) on npm.
This is then used by MDN to generate various sidebars and other things besides.
Usually, this happens every Thursday (MDN never deploys to production on Fridays).

Any admin can complete the following steps to publish a new version, but please coordinate releases with [Chris Mills](https://github.com/chrisdavidmills).

To create and publish a new version of `data`:

1. Figure out the new version number by looking at [past releases](https://github.com/mdn/data/releases). We're using only patch versions until something major changes. Lets assume the next version should be `2.0.43`.
2. On your updated and clean master branch, run `npm version patch -m "43rd patch of v2"`. Locally, this updates `package.json`, creates a new commit, and creates a new release tag (see also the docs for [npm version](https://docs.npmjs.com/cli/version)).
3. Push the commit to `master`: `git push origin master`. (replace `origin` with whatever your main repo remote is called).
4. Check if the commit passes fine on [Travis CI](https://travis-ci.org/mdn/data).
5. If Travis is happy, push the git tag as well: `git push origin v2.0.43`. (again, replace `origin` with whatever your main repo remote is called).
This step will trigger Travis to publish to npm automatically (see our [.travis.yml file](https://github.com/mdn/data/blob/master/.travis.yml)).
6. Check [Travis CI](https://travis-ci.org/mdn/data) again for the v2.0.43 build and also check [data on npm](https://www.npmjs.com/package/mdn-data) to see if `2.0.43` shows up correctly once Travis has finished its work.
7. Notify the MDN devs about the new release.
