# Release Guidelines for the Onfido JS SDK

We follow [semver](http://semver.org/) for versioning. Given a version number MAJOR.MINOR.PATCH, increment the:

* MAJOR version when you make incompatible API changes
* MINOR version when you add functionality in a backwards-compatible manner
* PATCH version when you make backwards-compatible bug fixes

## Creating a Release Candidate

An example release candidate version `<VERSION_RC>` could be `2.0.0-rc.1`

1. Make sure all features for the forthcoming release have been merged to `development` branch.
2. Checkout and pull `development` branch
    - `git checkout development && git pull`
3. Make sure README.md file has been updated
4. Make sure CHANGELOG.md has been updated
    - with new version number
    - with all Public, Internal and UI changes
    - with a link to diff between last and current version (at the bottom of the file)
5. Make sure MIGRATION.md has been updated, if applicable.
6. Update the SDK package version in `package.json` to `<VERSION_RC>`
7. Increment `BASE_32_VERSION` in `webpack.config.babel.js` e.g. `AA` => `AB`
    - **NOTE:** do it only if a breaking change is introduced between SDK and cross device client. This must be done only ONCE per release, *not* per release candidate
8. Install npm dependencies
    - `npm install`
9. Build the dist files for release candidate
    - `npm run build`
10. **[Cross Device]** Deploy dist files to the incremented `<BASE_32_VERSION>` on AWS production:
    - `aws s3 sync ./dist s3://onfido-assets-production/web-sdk/<BASE_32_VERSION>/ --exclude "*.html" --exclude "*.map" --acl public-read --delete`
11. **[Lazy loading]** [Deploy dist files to the release candidate <VERSION_RC> on S3 production](#deploying-the-release-to-S3-production)
    - use `<VERSION_RC>`
12. [Update JSFiddle demo](#update-jsfiddle-demo) link in README.md
13. Create a release branch: `release/<VERSION>`. Use the final version rather than a release candidate in the branch name
    - `git checkout -b release/<VERSION>`
14. Commit all changes with commit message including `Bump version to <VERSION_RC>`
    - use `<VERSION_RC>`
15. Create release candidate tag in `npm`:
    - `npm publish --tag next`
    - (if you don't have access, get credentials to npm from OneLogin)
16. Check that the `latest` tag has not been changed, only the `next` one:
    - `npm dist-tag ls onfido-sdk-ui`
17. Check you can install the package with `npm install onfido-sdk-ui@<VERSION_RC>`
18. On `release/<release_version>` branch, create a git tag for release candidate:
    - `git tag <VERSION_RC>`
    - `git push origin <VERSION_RC>`
19. Perform [regression testing](#MANUAL_REGRESSION)
    - test the SDK deployment on surge link associated with the PR

## Publishing a release

An example release version `<VERSION>` could be `2.0.0`

0. If the release candidate has not uncovered any bugs.
1. Bump version `package.json` to release version `<VERSION>`
2. Build the dist files for release version
    - `npm run build`
3. **[Cross Device]** Deploy dist files to the `<BASE_32_VERSION>` on AWS production:
    - `aws s3 sync ./dist s3://onfido-assets-production/web-sdk/<BASE_32_VERSION>/ --exclude "*.html" --exclude "*.map" --acl public-read --delete`
4. **[Lazy loading]** [Deploy the release dist to S3 production](#deploying-the-release-to-S3-production)
    - use `<VERSION>`
5. [Update JSFiddle demo](#update-jsfiddle-demo) link in README.md
6. Commit all changes with commit message including `Bump version to <VERSION>`
7. *Once release PR is approved*, on release branch create a tag with release version (without `rc`):
    * `git tag <VERSION>`
    * `git push origin <VERSION>`
8. *Perform the release on the release branch:*
    - `npm publish`
9. Check you can install your release with `npm install onfido-sdk-ui`
    - latest `<VERSION>` release should be installed
10. Merge `release/<release_version>` PR to `master`
11. Merge `master` to `development`
    * `git checkout master && git pull -p`
    * `git checkout development && git pull -p`
    * `git merge master`
    * `git push`
12. Create a new release on GitHub, using release tag:
    - title should be a version number `<VERSION>`
    - as description use the entries for that version from CHANGELOG.md
13. After the release: [Update Sample App](#update-sample-app)

## Deploying the release to S3 production
Deploying `dist/` folder to S3 is a crucial part of the release. It allows us to have a working demo of the SDK in JSFiddle and, more importantly, to support code splitting and lazy loading when the SDK is imported using HTML.

- Make sure version is bumped in `package.json`
- Make sure the `dist/` folder is updated and commited (by `npm run build`)
- Run `aws s3 sync ./dist s3://onfido-assets-production/web-sdk-releases/<VERSION> --exclude "*.html" --exclude "*.map" --acl public-read --delete`
  - **Note:** Mind that `<VERSION>` should be used only for release version and `<VERSION_RC>` should be used for release candidates instead. Apply according to instructions in guidelines!
- Make sure `style.css`, `onfido.min.js` and `onfido.crossDevice.min.js` are in the S3 folder

Now you can go on and update JSFiddle.

## Update JSFiddle Demo
- Make sure [Deploying the release to S3 production](#deploying-the-release-to-S3-production) step has been executed before
- Open the JSFiddle and update its resources to the following:
  - `https://s3-eu-west-1.amazonaws.com/onfido-assets-production/web-sdk-releases/<VERSION>/style.css`
  - `https://s3-eu-west-1.amazonaws.com/onfido-assets-production/web-sdk-releases/<VERSION>/onfido.min.js`
- Follow the migration notes and update the code if necessary
- Test the happy path
- Copy the new JSFiddle link into README.md

## Update Sample App
- Clone https://github.com/onfido/onfido-sdk-web-sample-app
- After the release, bump Onfido SDK version in `package.json` of Sample App
- If Onfido SDK release introduced breaking changes, apply them according to migration guide
- Issue PR with mentioned changes to master
