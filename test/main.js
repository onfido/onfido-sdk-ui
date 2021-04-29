import { Builder, Capabilities } from 'selenium-webdriver'
import remote from 'selenium-webdriver/remote'
import config from './config.json'
import Mocha from 'mocha'
import {
  createBrowserStackLocal,
  stopBrowserstackLocal,
} from './utils/browserstack'
import { eachP, asyncForEach } from './utils/async'
import { exec } from 'child_process'
import chalk from 'chalk'
import https from 'https'

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

const currentDate = Date.now().toString()
const random = () => Math.random().toString(36).substring(7)

const chromeCapabilities = Capabilities.chrome()
const chromeOptions = {
  args: [
    '--headless',
    '--window-size=1920,1080',
    '--use-fake-device-for-media-stream',
    '--use-fake-ui-for-media-stream',
    `--use-file-for-fake-video-capture=${__dirname}/resources/test-stream.y4m`,
    '--ignore-certificate-errors',
  ],
}
// chromeOptions changed to goog:chromeOptions'
//please refer https://github.com/elgalu/docker-selenium/issues/201
// https://github.com/ringcentral/testring/pull/63/files
chromeCapabilities.set('goog:chromeOptions', chromeOptions)

const createDriver = ({ name, localIdentifier }) => (browser) =>
  browser.remote
    ? new Builder()
        .usingServer('http://hub-cloud.browserstack.com/wd/hub')
        .withCapabilities({
          ...bsCapabilitiesDefault,
          ...browser,
          ...chromeCapabilities,
          name,
          build: currentDate,
          'browserstack.localIdentifier': localIdentifier,
        })
    : new Builder()
        .forBrowser(browser.browserName)
        .withCapabilities(chromeCapabilities)

const createBrowser = async (browser, testCase) => {
  const localIdentifier = random()

  const bsLocal = browser.remote
    ? await createBrowserStackLocal({
        ...browserstackLocalDefault,
        localIdentifier,
      })
    : null

  const driver = await createDriver({
    name: testCase.file,
    localIdentifier,
  })(browser).build()

  await driver.manage().setTimeouts({
    implicit: 10000,
    pageLoad: 10000,
  })

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
  let totalFailures = 0

  await eachP(config.tests, async (testCase) => {
    await asyncForEach(testCase.browsers, async (browser) => {
      const currentBrowser = browser.browserName
      let driver
      try {
        driver = await createBrowser(browser, testCase)
        const mocha = createMocha(driver, testCase)

        printTestInfo(browser, testCase)

        const failures = await mocha.runP()
        totalFailures += failures
        console.log(`Number of failures in ${currentBrowser} tests:`, failures)
        await driver.finish()
      } catch (e) {
        console.log(`Error executing ${currentBrowser} test case`, e)
        if (driver) driver.finish()
      }
    })
  })

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
