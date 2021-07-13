# Release Guidelines for the Onfido Web SDK

We follow semver for versioning. Given a version number MAJOR.MINOR.PATCH, increment the:

- MAJOR version when you make incompatible API changes
- MINOR version when you add functionality in a backwards-compatible manner
- PATCH version when you make backwards-compatible bug fixes

When performing a new release, the `MIGRATION.md` file should be updated with the following details:

- New version number
- All breaking changes, including code snippets whenever possible (for MAJOR versions)
- A list of translation keys changes (for all versions)

## Prerequisite

In order to perform the release you need to:

1. Download the Web SDK release configuration secret file and store it as `release/releaseSecret.js`
   - Edit secret file where necessary
2. Make sure that your git configuration allows you to use git commands without inputting password or passphrase

## Usage

Run `VERSION=x.x.x node release/release.js`

## After the release

1. Merge release/<release_version> PR to master
   - Add Onfido technical writers as a reviewer to get changelog/release notes reviewed.
2. Merge master to development
   - git checkout development && git pull
   - git checkout master && git pull -p
   - git checkout -b post-release/merge-<release_version>-to-development
   - git merge development
   - fix merging conflicts
   - git push --set-upstream origin post-release/merge-<release_version>-to-development
   - Create a PR against development
3. Create a new release on GitHub, using release tag:
   - title should be a version number <VERSION>
   - as description use the entries for that version from CHANGELOG.md
4. Create PR to update Sample App
