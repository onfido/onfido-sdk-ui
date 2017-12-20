# Release Guidelines for the Onfido JS SDK

We follow [semver](http://semver.org/) for versioning. Given a version number MAJOR.MINOR.PATCH, increment the:

* MAJOR version when you make incompatible API changes
* MINOR version when you add functionality in a backwards-compatible manner
* PATCH version when you make backwards-compatible bug fixes

## Creating a Release Candidate

An example release candidate version `<VERSION_RC>` could be `2.0.0-rc.1`

1. Make sure all features for the forthcoming release have been merged to `development` branch.
2. Checkout and pull `develop` branch
    - `git checkout develop && git pull`
3. Make sure README.md file has been updated
4. Make sure CHANGELOG.md has been updated
    - with new version number
    - with all Public, Internal and UI changes
5. Make sure MIGRATION.md has been updated, if applicable.
6. Update the SDK package version in `package.json` to `<VERSION_RC>`
7. Increment `BASE_32_VERSION` in `webpack.config.babel.js` e.g. `AA` => `AB`
    - do it only ONCE per release, *not* per release candidate
8. Install npm dependencies
    - `npm install`
9. Build the dist files for release candidate
    - `npm run build`
10. Run `aws s3 sync ./dist s3://onfido-assets-production/web-sdk/<BASE_32_VERSION>/ --exclude "*.html" --exclude "*.map" --acl public-read --delete`
11. [Deploy the release to S3 production](#deploying-the-release-to-S3-production)
    - run `aws s3 sync ./dist s3://onfido-assets-production/web-sdk-releases/<VERSION_RC> --exclude "*.html" --exclude "*.map" --acl public-read --delete`
12. Create a release branch: `release/<VERSION>`. Use the final version rather than a release candidate in the branch name
    - `git checkout -b release/<VERSION>`
13. [Update JSFiddle demo](#update-jsfiddle-demo) link in README.md
14. Commit all the changes above including the `<VERSION_RC>` in the commit message
15. Create release candidate tag in `npm`:
    - `npm publish --tag next`
    - if you don't have access, get credentials to npm from OneLogin
16. Check the `latest` tag had not moved:
    - `npm dist-tag ls onfido-sdk-ui`
17. Check you can install the package with `npm install onfido-sdk-ui@<VERSION_RC>`
18. On `release/<release_version>` branch, create a git tag for release candidate:
    - `git tag -a <VERSION_RC>`
    - `git push --tags`
19. Perform [regression testing](#MANUAL_REGRESSION)
    - test the SDK deployment on surge link associated with the PR

## Publishing a release

An example release version `<VERSION>` could be `2.0.0`

1. Bump version `package.json` to release version `<VERSION>`
2. Build the dist files for release version
    - `npm run build`
3. Deploy dist to staging on AWS
    - `aws s3 sync ./dist s3://onfido-assets-production/web-sdk/<BASE_32_VERSION>/ --exclude "*.html" --exclude "*.map" --acl public-read --delete`
4. [Deploy the release dist to production on AWS](#deploying-the-release-to-S3-production)
    - `aws s3 sync ./dist s3://onfido-assets-production/web-sdk-releases/<VERSION> --exclude "*.html" --exclude "*.map" --acl public-read --delete`
5. [Update JSFiddle demo](#update-jsfiddle-demo) link in README.md
6. Commit all the changes above including `Bump version to <VERSION>` in commit message
7. *Once release PR is approved*, on release branch create a tag with release version (without `rc`):
    * `git tag <VERSION>`
8. *Perform the release on the release branch:*
    - `npm publish`
9. Check you can install your release with `npm install onfido-sdk-ui`
    - latest `<VERSION>` release should be installed
10. Create a new release on GitHub, using release tag:
    - title should be a version number `<VERSION>`
    - as description use the entries for that version from CHANGELOG.md
11. Merge `release/<release_version>` PR to `master`
12. Merge `master` to `development`
    * `git checkout master && git pull -p`
    * `git checkout develop && git pull -p`
    * `git merge master`
    * `git push`
13. After the release: [Update Sample App](#update-sample-app)

## Deploying the release to S3 production
Deploying `dist/` folder to S3 is a crucial part of the release. It allows us to have a working demo of the SDK in JSFiddle and, more importantly, to support code splitting and lazy loading when the SDK is imported using HTML.

- Make sure version is bumped in `package.json`
- Make sure the `dist/` folder is updated and commited (by `npm run build`)
- Run `aws s3 sync ./dist s3://onfido-assets-production/web-sdk-releases/<VERSION> --exclude "*.html" --exclude "*.map" --acl public-read --delete`
- Make sure `dist/style.css`, `dist/onfido.min.js` and `dist/onfido.crossDevice.min.js` are in the S3 folder

Now you can go on and update JSFiddle.

## Update JSFiddle Demo
- Make sure [Deploying the release to S3 production](#deploying-the-release-to-S3-production) step has been executed before
- See if these exist:
  - `https://raw.githubusercontent.com/onfido/onfido-sdk-ui/<tag>/dist/style.css`
  - `https://raw.githubusercontent.com/onfido/onfido-sdk-ui/<tag>/dist/onfido.min.js`
- If they exist, copy each of them and paste to https://rawgit.com
- Open the JSFiddle and update its resources to the following:
  - `https://cdn.rawgit.com/onfido/onfido-sdk-ui/<tag>/dist/style.css`
  - `https://cdn.rawgit.com/onfido/onfido-sdk-ui/<tag>/dist/onfido.min.js`
- Follow the migration notes and update the code if necessary
- Test the happy path

## Update Sample App
- https://github.com/onfido/onfido-sdk-web-sample-app
- After the release, bump Onfido SDK version in `package.json` of Sample App
- If Onfido SDK release introduced breaking changes, apply them according to migration guide
- Issue PR with mentioned changes to master
