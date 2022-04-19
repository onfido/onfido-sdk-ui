# Release Guidelines for the Onfido Web SDK

We follow semver for versioning. Given a version number MAJOR.MINOR.PATCH, increment the:

- MAJOR version when you make incompatible API changes
- MINOR version when you add functionality in a backwards-compatible manner
- PATCH version when you make backwards-compatible bug fixes

When performing a new release, the `MIGRATION.md` file should be updated with the following details:

- New version number
- All breaking changes, including code snippets whenever possible (for MAJOR versions)
- A list of translation keys changes (for all versions)

- Include Onfido technical writer(s) as a reviewer to get changelog/release notes reviewed in the release PR.

## Prerequisite

In order to perform the release you need to:

1. Download the Web SDK release configuration secret file and store it as `release/releaseSecret.js`
   - Edit secret file where necessary
2. Make sure that your git configuration allows you to use git commands without inputting password or passphrase

## Usage

Run `VERSION=x.x.x node release/release.js`

## After the release

1. Merge release/<release_version> PR to master
2. Merge `master` to `development`
   - git checkout development && git pull
   - git checkout master && git pull -p
   - git checkout -b post-release/merge-<release_version>-to-development
   - git merge development
   - fix merging conflicts
   - git push --set-upstream origin post-release/merge-<release_version>-to-development
   - Create a PR against development
3. Publish the draft release created on GitHub by editing it, check that:
   - title should be a version number <release_version>, if it is an LTS release title should be edited to include the `-LTS` suffix, e.g.
     - title for LTS release 5.11.4 is `5.11.4-LTS` with tag `5.11.4`
     - title for regular release 6.14.0 is `6.14.0` with tag `6.14.0`
   - description should be all the entries for that version from CHANGELOG.md
4. Create PR to update Sample App
