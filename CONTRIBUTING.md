## Branch structure

- **next** - the `next` version on npm, and the development branch where most work occurs
- **prerelease** - the `prerelease` version on npm, where eventual changes to `main` get tested
- **main** - the `latest` version on npm and the stable version that most users use

## Release process

1. All PRs should target the `next` branch, which depends on the `next` version of Storybook.
2. When merged, a new version of this package will be released on the `next` NPM tag.
3. If the change contains a bugfix that needs to be patched back to the stable version, please note that in PR description.
4. PRs labeled `pick` will get cherry-picked back to the `prerelease` branch and will generate a release on the `prerelease` npm tag.
5. Once validated, `prerelease` PRs will get merged back to the `main` branch, which will generate a release on the `latest` npm tag.