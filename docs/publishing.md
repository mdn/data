# Publishing a new version of MDN `mdn-data`

Releases are published on GitHub and to the npm registry as the [mdn-data](https://www.npmjs.com/package/mdn-data) package.
This is then used by MDN to generate sidebars [as well as other features](https://github.com/search?q=repo%3Amdn%2Fyari%20mdn-data&type=code) such as info boxes on pages.

In order to publish a release:

1. Commits need to adhere to [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) and only `fix:` and `feat:` commits are considered.
2. The [publish-release.yml](https://github.com/mdn/data/blob/main/.github/workflows/publish-release.yml) workflow reuses the [mdn/workflows workflow](https://github.com/mdn/workflows/blob/main/.github/workflows/publish-release.yml) by the same name.
3. The workflow uses [`release-please`](https://github.com/googleapis/release-please), which opens a release pull request if there are relevant commits (following the conventions described in **step 1**) on the `main` branch since the last-published version.
4. When the pull request from **step 3** is merged, `release-please` creates a GitHub release and a package is published to npm via the [publish-release.yml](https://github.com/mdn/data/blob/main/.github/workflows/publish-release.yml) workflow.

After these steps have completed, you may check [`mdn-data` on npm](https://www.npmjs.com/package/mdn-data) to see if the release shows up correctly. 🎉
