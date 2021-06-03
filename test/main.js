import { Builder } from 'selenium-webdriver'
import remote from 'selenium-webdriver/remote'
import Mocha from 'mocha'
import {
  createBrowserStackLocal,
  stopBrowserstackLocal,
} from './utils/browserstack'
import { eachP, asyncForEach } from './utils/async'
import { exec } from 'child_process'
import chalk from 'chalk'
import https from 'https'
import chrome from 'selenium-webdriver/chrome'
import firefox from 'selenium-webdriver/firefox'
import safari from 'selenium-webdriver/safari'
import edge from 'selenium-webdriver/edge'

let config
const browsersFailures = {}
let totalFailures = 0

if (!process.env.CONFIG_FILE) {
  console.error('INFO: CONFIG_FILE not set, so using the default config.json')
  config = require('./config')
} else {
  config = require(`./${process.env.CONFIG_FILE}`)
}

if (!process.env.BROWSERSTACK_USERNAME) {
  console.error('ERROR: BrowserStack username not set')
}
if (!process.env.BROWSERSTACK_ACCESS_KEY) {
  console.error('ERROR: BrowserStack access key not set')
}

// Input capabilities
const bsCapabilitiesDefault = {
  acceptSslCerts: 'true',
  forceLocal: 'true',
  'browserstack.debug': 'true',
  project: 'Web SDK',
  'browserstack.user': process.env.BROWSERSTACK_USERNAME,
  'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY,
  'browserstack.selenium_version': '3.141.59',
  'browserstack.sendKeys': true,
  'browserstack.local': 'true',
  'browserstack.ie.enablePopups': 'false',
  unexpectedAlertBehaviour: 'dismiss',
  unexpectedPromptBehaviour: 'dismiss',
  binarypath: './test/BrowserStackLocal',
}

// replace <browserstack-accesskey> with your key. You can also set an environment variable - "BROWSERSTACK_ACCESS_KEY".
const browserstackLocalDefault = {
  key: bsCapabilitiesDefault['browserstack.key'],
}

export let isRemoteBrowser
export let browserName
const currentDate = Date.now().toString()
const random = () => Math.random().toString(36).substring(7)

const chromeOptions = new chrome.Options()
  .setAcceptInsecureCerts(true)
  .addArguments('--headless')
  .addArguments('--window-size=1920,1080')
  .addArguments('--use-fake-device-for-media-stream')
  .addArguments('--use-fake-ui-for-media-stream')
  .addArguments(
    `--use-file-for-fake-video-capture=${__dirname}/resources/test-stream.y4m`
  )
  .addArguments('--ignore-certificate-errors')
  .addArguments('--ignore-ssl-errors=yes')

const firefoxOptions = new firefox.Options()
  .setAcceptInsecureCerts(true)
  .setPreference('media.navigator.permission.disabled', true)
  .setPreference('permissions.default.microphone', 1)
  .setPreference('permissions.default.camera', 1)

const safariOptions = new safari.Options().setAcceptInsecureCerts(false)

const edgeOptions = new edge.Options()
  .setAcceptInsecureCerts(true)
  .addArguments('allow-file-access-from-files')
  .addArguments('use-fake-device-for-media-stream')
  .addArguments('use-fake-ui-for-media-stream')
  .addArguments(
    `--use-file-for-fake-video-capture=${__dirname}/resources/test-stream.y4m`
  )
  .addArguments('--disable-features=EnableEphemeralFlashPermission')

const createDriver = ({ name, localIdentifier }) => (browser) =>
  browser.remote
    ? new Builder()
        .usingServer('http://hub-cloud.browserstack.com/wd/hub')
        .withCapabilities({
          ...bsCapabilitiesDefault,
          ...browser,
          name,
          build: currentDate,
          'browserstack.localIdentifier': localIdentifier,
        })
    : new Builder()
        .forBrowser(browser.browserName)
        .setChromeOptions(chromeOptions)
        .setFirefoxOptions(firefoxOptions)
        .setSafariOptions(safariOptions)
        .setEdgeOptions(edgeOptions)

const createBrowser = async (browser) => {
  const localIdentifier = random()

  const bsLocal = browser.remote
    ? await createBrowserStackLocal({
        ...browserstackLocalDefault,
        localIdentifier,
      })
    : null

  const driver = await createDriver({
    name: browser.name,
    localIdentifier,
  })(browser).build()

  await driver.manage().setTimeouts({
    implicit: 10000,
    pageLoad: 10000,
  })

  isRemoteBrowser = browser.remote
  browserName = browser.browserName
  browsersFailures[browserName] = 0

  if (browser.remote) driver.setFileDetector(new remote.FileDetector())
  const quitAll = async () => {
    await Promise.all([
      driver.quit(),
      ...(bsLocal ? [stopBrowserstackLocal(bsLocal)] : []),
    ])
      .then(() => {
        console.log(chalk.green('Browser closed'))
      })
      .catch((e) => {
        console.log(chalk.yellow('Error closing browser'), e)
      })
  }

  driver.finish = async () => {
    console.log(chalk.gray('Closing browser'))
    await quitAll()
  }

  return driver
}

const createMocha = (driver, testCase) => {
  // Create our Mocha instance
  const mocha = new Mocha({
    reporter: 'mochawesome',
    reporterOptions: {
      overwrite: false,
      reportTitle: 'UI Tests',
      reportFilename: 'UITestReport',
      reportDir: './dist/reports/UITestsReport',
      assetsDir: './dist/reports/UITestsReport',
    },
    timeout: testCase.timeout,
  })
  // By default `require` caches files, making it impossible to require the same file multiple times.
  // Since we want to execute the same tests against many browsers we need to prevent this behaviour by
  // clearing the require cache.
  mocha.suite.beforeAll('Printing out browser config...', function () {
    global.isRemoteBrowser = isRemoteBrowser
    global.browserName = browserName
    console.log(
      `Just setting global variables...browser:${browserName}, are the tests running on BrowserStack ${isRemoteBrowser}`
    )
  })
  mocha.suite.beforeEach('Set retry', function () {
    this.currentTest.retries(1)
  })
  mocha.suite.afterEach('Capture total number of test failures', function () {
    const currentTestState = this.currentTest.state
    //As we are running a 'single' test as test/specs/chrome.js, we will only be able to report a single error
    //i.e. if we have 3 failures...BS will only log the first one.
    if (isRemoteBrowser && currentTestState === 'failed') {
      browsersFailures[browserName] = +1
    }
    if (isRemoteBrowser === false && currentTestState === 'failed') {
      browsersFailures[browserName] = +1
    }
  })
  mocha.suite.afterAll('Report test failures to BrowserStack', function () {
    if (browsersFailures[browserName] > 0 && isRemoteBrowser === true) {
      driver.executeScript(
        `browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "There were test failures!"}}`
      )
    }
    if (browsersFailures[browserName] === 0 && isRemoteBrowser === true) {
      driver.executeScript(
        `browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "No tests failed!"}}`
      )
    }
  })
  mocha.suite.on('require', (global, file) => {
    delete require.cache[file]
  })

  mocha.addFile(`${testCase.file}`)
  mocha.suite.ctx.driver = driver

  mocha.runP = () =>
    new Promise((resolve) => {
      mocha.run(resolve)
    })
  return mocha
}

const printTestInfo = (browser, testCase) => {
  console.log(
    browser.os
      ? `Running ${testCase.file} against ${browser.browserName} on ${browser.os}`
      : `Running ${testCase.file} on ${browser.browserName}`
  )
}

const runner = async () => {
  await waitForMockServer()

  await eachP(config.tests, async (testCase) => {
    await asyncForEach(testCase.browsers, async (browser) => {
      const currentBrowser = browser.browserName
      let driver
      try {
        driver = await createBrowser(browser, testCase)
        const mocha = createMocha(driver, testCase)

        printTestInfo(browser, testCase)

        await mocha.runP()
        console.log(
          `Number of failures in ${currentBrowser} tests:`,
          browsersFailures[browserName]
        )

        await driver.finish()
      } catch (e) {
        console.log(`Error executing ${currentBrowser} test case`, e)
        if (driver) driver.finish()
      }
    })
  })

  for (const property in browsersFailures) {
    totalFailures += browsersFailures[property]
  }

  console.log(chalk.green('Tests finished'))
  process.exit(totalFailures > 0 ? 1 : 0)
}

const killMockServer = (dockerContainerId) => {
  if (!dockerContainerId) {
    return
  }

  console.log(chalk.grey('Killing mock server'))

  exec(`docker stop ${dockerContainerId} -t0`, (error) => {
    if (error) {
      console.log(chalk.yellow('Error killing mock server:'), error)
    } else {
      console.log(chalk.green('Mock server killed'))
    }
  })
}

console.log(chalk.bold.green('Starting mock server'))

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const pingMockServer = () => {
  const options = {
    hostname: 'localhost',
    port: 8080,
    path: '/api/ping',
    method: 'GET',
    rejectUnauthorized: false,
  }

  return new Promise((resolve, reject) => {
    https
      .request(options, (res) => {
        res.on('data', (data) => resolve(data))
      })
      .on('error', reject)
      .end()
  })
}

/**
 * There's always an amount of delay time for the mock server to be alive completely,
 * after the `docker run ...` command exits with the container ID.
 * Without this waiting method, we can see several first tests to be failed,
 * which is clearly a false positive.
 * Particularly the sleep(1000) is to defer the ping action to be run every 1 second,
 * instead of every process tick, which is unnecessarily wasteful.
 */
const waitForMockServer = async () => {
  let isMockServerRunning = false
  let retries = 0

  while (!isMockServerRunning) {
    // 30s timeout for mock server waiting
    if (retries >= 30) {
      console.error(
        chalk.red(`It seems that the mock server wasn't started properly!`)
      )

      process.exit(1)
    }

    try {
      console.error(
        chalk.yellow(`(${retries + 1}) Waiting for mock server to respond...`)
      )
      await pingMockServer()
      isMockServerRunning = true
    } catch (err) {
      retries += 1
      await sleep(1000)
    }
  }
}

const runTests = async (dockerContainerId) => {
  if (dockerContainerId) {
    console.log(
      chalk.green(
        `Mock server is running in docker container with id ${chalk.yellow(
          dockerContainerId
        )}`
      )
    )
  }

  await waitForMockServer()
  runner()

  const cleanUp = () => {
    killMockServer(dockerContainerId)
  }

  process.on('exit', cleanUp) // Script stops normally
  process.on('SIGINT', cleanUp) // Script stops by Ctrl-C
  process.on('SIGUSR1', cleanUp) // Script stops by "kill pid"
  process.on('SIGUSR2', cleanUp) // Script stops by "kill pid"
  process.on('uncaughtException', cleanUp) // Script stops by uncaught exception
}

const findMockServerId = (callback) =>
  exec('docker ps | grep onfido-web-sdk:ui-mock-server', (error, stdout) => {
    let dockerContainerId

    if (!error) {
      const parsed = stdout.split(/[\s\t]+/)

      if (parsed.length) {
        dockerContainerId = stdout.split(/[\s\t]+/)[0]
      }
    }

    typeof callback === 'function' && callback(dockerContainerId)
  })

const runMockServerAndTests = () =>
  exec('npm run mock-server:run', (error) => {
    if (error) {
      console.error(chalk.yellow('Error running mock server:'), error)
      return
    }

    findMockServerId(runTests)
  })

runMockServerAndTests()

//ref: https://nehalist.io/selenium-tests-with-mocha-and-chai-in-javascript/
//ref: https://github.com/mochajs/mocha/wiki/Using-mocha-programmatically
