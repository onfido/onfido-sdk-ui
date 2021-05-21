# Testing guidelines

Guide to UI tests for Web SDK.

### Software requirements

1. Google Chrome (latest version)
2. Chromedriver (WebDriver for Chrome)

- `brew cask install chromedriver`
- **Note:** if you have chromedriver already installed, make sure it's the latest version: `brew cask upgrade chromedriver`

If you would like to run the tests against other browsers...

Firefox:

- `npm install` should take care of installing Gekodriver (Webdriver for Firefox)
- **Note:** if you have macOS Catalina installed, you will need to run `npm install -g geckodriver`, this is due to this
  issue https://github.com/mozilla/geckodriver/issues/1629

Safari:

- Simply having Safari installed on your machine is enough

Microsoft Edge:

1. Microsoft Edge (https://www.microsoft.com/en-us/edge)
2. Microsoft Edge Driver (WebDriver for Edge, https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/)

- **Note:** your Microsoft Edge Driver needs to match the Edge browser version you are running and needs to be installed to your path (i.e. on OSX `/usr/local/bin`)

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

#### Running against different browsers locally

- Within `config.json` you simply need to modify the `browserName` value to any of the ones illustrated

`"browsers": [ { "browserName": "chrome | firefox | safari | MicrosoftEdge", "remote": false }`

### BrowserStack notes

- Specific to Safari on BrowserStack, you need to explicitly set the `localhostUrl` value in `config.json` to
  be read as `"localhostUrl": "https://bs-local.com:8080/",` this is due to the way Safari handles `https://localhost`.

### `test` directory structure

- `pageobjects/`contains files with page objects that map objects by css selectors and functions that use these page objects
- `resources/`contains files needed for the upload tests
- `specs/` contains files with the tests implemented
- `utils/` contains util files with the set up for accessibility testing, browserstack and mocha
- `config.json`contains configuration for the browsers on which the tests will run

- **Note:** you can now pass in an environment variable `CONFIG_FILE` if you wish to use a file other than `config.json`,
  i.e. `CONFIG_FILE='mynewconfig.json' npm run test:ui`, if this is not specified, it will use the default `config.json`

### Troubleshooting

If you face issues regarding test setup or weird errors during test execution, there are some things to check:

- make sure your Google Chrome is up to date
- make sure your Chromedriver is up to date
- make sure your webserver is up and running (`npm run dev`). If that command gives you an error, most probably the local server is already running on port 8080.
