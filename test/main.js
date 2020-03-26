import {Builder, Capabilities} from 'selenium-webdriver'
import remote from 'selenium-webdriver/remote'
import config from './config.json'
import Mocha from 'mocha'
import {createBrowserStackLocal,stopBrowserstackLocal} from './utils/browserstack'
import {eachP,asyncForEach} from './utils/async'
import {exec} from 'child_process'

if (!process.env.BROWSERSTACK_USERNAME) {
  console.error("ERROR: BrowserStack username not set");
}
if (!process.env.BROWSERSTACK_ACCESS_KEY) {
  console.error("ERROR: BrowserStack access key not set");
}

// Input capabilities
const bsCapabilitiesDefault = {
  'acceptSslCerts' : 'true',
  'browserstack.debug': 'true',
  'project': 'JS SDK',
  'browserstack.user' : process.env.BROWSERSTACK_USERNAME,
  'browserstack.key' : process.env.BROWSERSTACK_ACCESS_KEY,
  'browserstack.local' : 'true',
  'browserstack.ie.enablePopups' : 'false',
  'unexpectedAlertBehaviour': 'dismiss',
  'unexpectedPromptBehaviour': 'dismiss'
}

// replace <browserstack-accesskey> with your key. You can also set an environment variable - "BROWSERSTACK_ACCESS_KEY".
const browserstackLocalDefault = {
  'key': bsCapabilitiesDefault['browserstack.key']
};

const currentDate = Date.now().toString();
const random = () => Math.random().toString(36).substring(7)

const chromeCapabilities = Capabilities.chrome()
const chromeOptions = {
  'args': ['--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream', `--use-file-for-fake-video-capture=${__dirname}/resources/test-stream.y4m`, '--ignore-certificate-errors']
}
// chromeOptions changed to goog:chromeOptions'
//please refer https://github.com/elgalu/docker-selenium/issues/201
// https://github.com/ringcentral/testring/pull/63/files
chromeCapabilities.set('goog:chromeOptions', chromeOptions);

const createDriver = ({name, localIdentifier}) => browser =>
  browser.remote ?
    new Builder()
    .usingServer('http://hub-cloud.browserstack.com/wd/hub')
    .withCapabilities({
      ...bsCapabilitiesDefault,
      ...browser,
      ...chromeCapabilities,
      name,
      build: currentDate,
      'browserstack.localIdentifier' : localIdentifier
    })
    : new Builder().forBrowser(browser.browserName).withCapabilities(chromeCapabilities)

const createBrowser = async (browser, testCase) => {
  const localIdentifier = random();

  const bsLocal = browser.remote ? await createBrowserStackLocal({
    ...browserstackLocalDefault,
    localIdentifier
  }) : null

  const driver = await createDriver({
    name:testCase.file,
    localIdentifier
  })(browser).build()

  await driver.manage().setTimeouts({
    implicit: 10000,
    pageLoad: 10000
  })

  if (browser.remote) driver.setFileDetector(new remote.FileDetector);
  const quitAll = async () => {
    await Promise.all([
      driver.quit(),
      ...(bsLocal ? [stopBrowserstackLocal(bsLocal)] : [])
    ]).then(()=>{console.log("finished browser")})
    .catch(e=>{console.log("error finishing browser",e)})
  }

  driver.finish = async () => {
    console.log("finishing browser")
    await quitAll()
  }

  return driver;
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
    timeout: testCase.timeout
  });
  // By default `require` caches files, making it impossible to require the same file multiple times.
  // Since we want to execute the same tests against many browsers we need to prevent this behaviour by
  // clearing the require cache.
  mocha.suite.on('require', (global, file) => {
    delete require.cache[file];
  });

  mocha.addFile(`${testCase.file}`);
  mocha.suite.ctx.driver = driver

  mocha.runP = () => new Promise((resolve) => {
    mocha.run(resolve)
  })
  return mocha
}

const printTestInfo = (browser, testCase) => {
  console.log(browser.device ?
    `Running ${testCase.file} on ${browser.device}` :
    `Running ${testCase.file} against ${browser.browserName} on ${browser.os}`
  );
}

const runner = async () => {
  let totalFailures = 0;

  await eachP(config.tests, async testCase => {
    await asyncForEach(testCase.browsers, async browser => {
      let driver;
      try {
        console.log("Browser:", browser.browserName)
        driver = await createBrowser(browser, testCase)
        const mocha = createMocha(driver, testCase)

        printTestInfo(browser, testCase)

        const failures = await mocha.runP()
        totalFailures += failures
        console.log("Number of failures in tests:", failures)
        await driver.finish()
      } catch (e) {
        console.log("Error executing test case",e)
        if (driver) driver.finish()
      }
    });
    console.log("Finished test")
  });

  console.log("finished")
  process.exit(totalFailures > 0 ? 1 : 0);
}

const server = exec("npm run travis")
const killServer = ()=> {
  console.log("Killing server")
  if (!server.killed) {
    server.kill()
    console.log("Kill signal sent")
  }
  else {
    console.log("Kill signal already sent")
  }
}

server.stdout.on('data', (data) => {
  if (data.includes("Available on:")) {
    runner()
  }
})

process.on('exit', () => {
  killServer()
})

//ref: https://nehalist.io/selenium-tests-with-mocha-and-chai-in-javascript/
//ref: https://github.com/mochajs/mocha/wiki/Using-mocha-programmatically
