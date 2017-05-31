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
* Build the dist files with `npm run build`
* Commit the above using the version as the commit message
* On the release branch run `npm publish --tag next`
  * Get the credentials from One Login
  * Read about npm and release candidates [here](https://medium.com/@mbostock/prereleases-and-npm-e778fc5e2420)
* Check the `latest` tag had not moved with `npm dist-tag ls onfido-sdk-ui`
* Check you can install the package with `npm install onfido-sdk-ui@<version>`
* Create a new pre-release on GitHub:
  * Pointing to the release commit on the release branch
  * The release tag and title should be the version
  * The description should be the change log entry for the release
* Create a pull request from the release branch into master
* Test the SDK deployment on surge associated with the PR

## Publishing a release

An example `<version>` could be `2.0.0`

* Create a release candidate
* On the release branch update the version in `package.json`
* Update the change log entry of the release candidate you are using
* Perform the release: on the release branch run `npm publish`
* Check you can install your release with `npm install onfido-sdk-ui`
* Create a new release on GitHub
* Commit and merge the release branch into master
