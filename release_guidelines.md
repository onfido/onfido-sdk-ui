# Release Guidelines for the Onfido JS SDK

We follow [semver](http://semver.org/) for versioning. Given a version number MAJOR.MINOR.PATCH, increment the:

* MAJOR version when you make incompatible API changes
* MINOR version when you add functionality in a backwards-compatible manner
* PATCH version when you make backwards-compatible bug fixes

## Creating a Release Candidate

An example `<version>` could be `2.0.0-rc.1`

* Create a release branch: `release/<version>`. Use the final version rather than a release candidate in the branch name.
* Update the version in `package.json`
* Update the change log following [this](http://keepachangelog.com/)
* Increment BASE_36_VERSION in `webpack.config.babel.js` e.g. AA => AB
  * You only need to do this once per release, *not* per release candidate
* Build the dist files with `npm run build`
* Run `aws s3 sync ./dist s3://onfido-assets-production/web-sdk/<base36 version>/ --exclude "*.html" --exclude "*.map" --acl public-read --delete`
* Commit the above using the version as the commit message
* Create a pull request from the release branch into master
* [Update JSFiddle demo](#update-jsfiddle-demo)
* On the release branch run `npm publish --tag next`
  * Get the credentials from One Login
  * Read about npm and release candidates [here](https://medium.com/@mbostock/prereleases-and-npm-e778fc5e2420)
* Check the `latest` tag had not moved with `npm dist-tag ls onfido-sdk-ui`
* Check you can install the package with `npm install onfido-sdk-ui@<version>`
* Create a git tag with rc version on github, i.e `2.0.0-rc.1`:
  * Pointing to the release commit on the release branch
  * The release tag and title should be the version
  * The description should be the change log entry for the release
* Test the SDK deployment on surge associated with the PR

## Publishing a release

An example `<version>` could be `2.0.0`

* Create a release candidate
* On the release branch update the version in `package.json`
* Update the change log entry of the release candidate you are using
* [Update JSFiddle demo](#update-jsfiddle-demo)
* Perform the release: on the release branch run `npm publish`
* Check you can install your release with `npm install onfido-sdk-ui`
* Create a new release on GitHub
* Commit and merge the release branch into master
* After the release: [Update Sample App](#update-sample-app)

### Deploying the release to S3 production and allow HTML script users to use SDK
Deploying dist to S3 is a crucial part of the release. It allows us to have a working demo of the SDK in JSFiddle and, more importantly, to support code splitting and lazy loading when the SDK is imported using HTML.

* Run `npm run build`
* Commit the content of dist to github, including style.css, onfido.min.js and onfido.crossDevice.min.js
* Make sure git tag is created for this version (i.e. `2.0.0`)
* Run `aws s3 sync ./dist s3://onfido-assets-production/web-sdk-releases/<tag> --exclude "*.html" --acl public-read --delete`

## Update JSFiddle Demo
* Open the JSFiddle and update its resources to the following:
  * `https://s3-eu-west-1.amazonaws.com/onfido-assets-production/web-sdk-releases/<tag>/style.css`
  * `https://s3-eu-west-1.amazonaws.com/onfido-assets-production/web-sdk-releases/<tag>/onfido.min.js`
* Follow the migration notes and update the code if necessary
* Test the happy path

## Update Sample App
* https://github.com/onfido/onfido-sdk-web-sample-app
* After the release, bump Onfido SDK version in `package.json` of Sample App
* If Onfido SDK release introduced breaking changes, apply them according to migration guide
* Issue PR with mentioned changes to master

## Outside of the release

### Deploying the release to the S3 staging for use in the cross device flow

This should be updated by developers when testing new features. Therefore it should never be behind production.

* Run `npm run build:dev`
* Run `aws s3 sync ./dist s3://onfido-assets-staging/web-sdk/ --exclude "*.html" --acl public-read --delete`
