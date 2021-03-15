# Testing guidelines

Guide to UI tests for Web SDK.

### Software requirements

1. Google Chrome (latest version)
2. Chromedriver (WebDriver for Chrome)

- `brew cask install chromedriver`
- **Note:** if you have chromedriver already installed, make sure it's the latest version: `brew cask upgrade chromedriver`

### Running tests locally

Our UI tests also run on BrowserStack. If you would like to run them on your BrowserStack account, set an environment variable `BROWSERSTACK_USERNAME` and `BROWSERSTACK_ACCESS_KEY`.

1. Run `test.sh` script OR
2. Run:

- `npm run build:test`. This will:
  - Build the front-end with `NODE_ENV=production` using Webpack.
  - Build test server using Deno and generate a Docker image with tag `onfido-web-sdk:ui-mock-server`.
- `npm run test:ui`. This will:
  - Parse and load UI test scenarios from `test/config.json`.
  - Run the test server image with tag `onfido-web-sdk:ui-mock-server` and wait until it responds.
  - Run the test scenarios against test server at `https://localhost:8080`.

### `test` directory structure

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
- make sure your webserver is up and running (`npm run dev`). If that command gives you an error, most probably the local server is already running on port 8080.
