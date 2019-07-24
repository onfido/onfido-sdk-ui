# Testing guidelines

Guide to UI tests for JS SDK.

## Setup

### Software requirements

1. Google Chrome (latest version)
2. Chromedriver (WebDriver for Chrome)
    - `brew cask install chromedriver`
    - **Note:** if you have chromedriver already installed, make sure it's the latest version: `brew cask upgrade chromedriver`
3. Firefox (latest version)
4. Geckdriver (WebDriver for Firefox)
    - `brew install geckodriver`
    - **Note:** if you have geckodriver already installed, make sure it's the latest version: `brew upgrade geckodriver`

### Test environment

Tests can be run on `test.sh` script runs on two different environments, depending on where it was called:
- if called by **CI**, it'll run webpack against `ENV=PRODUCTION`
- if called **locally**, it'll run webpack against `ENV=DEVELOPMENT`

## Running tests locally

**Express run:**

- Run:
  -  `test.sh` script
  - it will start webpack server on development environment, install dependencies and execute all `.feature` tests on Chrome browser by default
  - you can run against other browser than Chrome, just specify BROWSER env variable on test.sh execution, i.e: `BROWSER=firefox bash test.sh`

**Custom run:**

In `test/` directory:
1. Run `bundle install` to install ruby dependencies
2. Run `bundle exec cucumber BROWSER=chrome SDK_URL=${SDK_URL} USE_SECRETS=false SEED_PATH=false DEBUG=false`, where you can customize:
    - `BROWSER` - browser to run tests against (possible choices: `chrome`, `firefox`)
    - `SDK_URL` - url to deployed SDK (possible choices: any surge link, or `"https://localhost:8080/?async=false"` when webpack started locally using `npm run dev`.
    **Note:** It's very important to add `?async=false` GET parameter to the end of any URL so that tests wait for JWT to be generated)

## Maintenance

When developing a new feature, in most cases you will perform changes only in places mentioned under [Test structure](#test-structure) section. If new flow is introduced, for example cross-device flow, a separate page object, step definition and `.feature` file can be created to handle the testing.

If there's a need to introduce a change in `monster` gem, follow the steps:
- create a branch out of master on `monster` gem
- bump version in `monster/lib/monster/version.rb` according to your changes
- for development purposes change `monster` gem dependency line in `test/Gemfile` of this project:
  - if changes on monster branch: `gem 'monster', :git => 'git@bitbucket.org:onfido/monster.git', :branch => 'your-branch-on-monster'`
  - if changes on local changes: `gem 'monster', :path => 'your/local/path/to/monster'`
- run `bundle update monster` in `test/` directory
- once solution tested, issue PR with your monster branch to `master` and assign 2 QAs
- if PR approved, create tag with version from `version.rb`
  - `git tag <version>` version
- merge your `monster` branch to `master`
- back in this project, update `monster` gem dependency line in `test/Gemfile` to reflect latest changes in monster by tag:
  -  `gem 'monster', :git => 'git@bitbucket.org:onfido/monster.git', :tag => '<version_from_your_branch>'`
- run `bundle update monster` in `test/` directory to apply the changes (`Gemfile.lock` should be updated)

### Test structure

All test artifacts are in `test/` directory:
- `pageobjects/` - contains files with page objects that map objects by css selectors and functions that use these page objects
- `step_definitions/` - contains generic, commonly shared steps used in `.feature` files
- `*.feature` - behavior-driven tests written in Gherkin
- `support/` - contains support for setting up tests, i.e requires `monster` gem dependency
- `scripts/` - contains scripts to setup test environment on Travis CI


### Troubleshooting

If you face issues regarding test setup or weird errors during test execution, there are some things to check:
- make sure your Google Chrome is up to date
- make sure your Chromedriver is up to date
- make sure webpack server starts properly (`npm run dev`)
