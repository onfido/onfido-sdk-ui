# Testing guidelines

Guide to UI tests for JS SDK.

### Software requirements

1. Google Chrome (latest version)
2. Chromedriver (WebDriver for Chrome)
  - `brew cask install chromedriver`
  - **Note:** if you have chromedriver already installed, make sure it's the latest version: `brew cask upgrade chromedriver`

### Running tests locally

 1. Run `test.sh` script OR
 2. Run: 
  - `npm run build:dev`
  - `npm run test:ui`

### Test structure in `test` directory

- `pageobjects/`contains files with page objects that map objects by css selectors and functions that use these page objects
- `resources/`contains files needed for the upload tests
- `scripts/` contains scripts to setup test environment on Travis CI
- `specs/` contains files with the tests implemented
- `utils/` contains util files with the set up for accessibility testing, browserstack and mocha
- `config.json`contains configuration for the browsers on which the tests will run

### Troubleshooting
If you face issues regarding test setup or weird errors during test execution, there are some things to check:

- make sure your Google Chrome is up to date
- make sure your Chromedriver is up to date
- make sure your webserver is up and running (`npm run travis`)