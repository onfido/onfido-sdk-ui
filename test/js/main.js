//require("@babel/register");
const {Builder} = require('selenium-webdriver');
const remote = require('selenium-webdriver/remote');
const browserstack = require('browserstack-local');
const config = require('./config.json');
const Mocha = require('mocha');

// Input capabilities
const bsCapabilities = {
  'acceptSslCerts' : 'true',
  'browserstack.debug': "true",
   project: 'JS SDK',
  'browserstack.user' : process.env.BROWSERSTACK_USERNAME,
  'browserstack.key' : process.env.BROWSERSTACK_ACCESS_KEY,
  'browserstack.local' : 'true',
  'browserstack.localIdentifier' : 'Test123'
}




const bs_local = new browserstack.Local();

// replace <browserstack-accesskey> with your key. You can also set an environment variable - "BROWSERSTACK_ACCESS_KEY".
const bs_local_args = {
  'key': bsCapabilities['browserstack.key'],
  'localIdentifier' : bsCapabilities['browserstack.localIdentifier'],
  'force': 'true'
};



const currentDate = Date.now().toString();

// ES5 native `Array.prototype.forEach` is not async; since tests are executed asynchronously we're going to need an
// async version of `forEach`
let asyncForEach = async (arr, cb) => {
    for (let i = 0; i < arr.length; i++) {
        await cb(arr[i], i, arr);
    }
};

const createBrowser = async (browser, testCase) => {
  const bsConfig = Object.assign(bsCapabilities, browser);
  const driver = await new Builder()
      .usingServer('http://hub-cloud.browserstack.com/wd/hub')
      .withCapabilities(Object.assign({
          name: testCase.file,
          build: currentDate,
      }, bsConfig))
      .build();
  driver.manage().setTimeouts({
    implicit: 3000
  })
  driver.setFileDetector(new remote.FileDetector);
  return driver;
}

const runner = async () => {
    // Iterate over all browsers.
    await asyncForEach(config.browsers, async browser => {
        // Iterate over all tests.
        await asyncForEach(config.tests, async testCase =>
            new Promise(async (resolve, reject) => {
                // Set the global `driver` variable which will be used within tests.
                const driver = await createBrowser(browser, testCase)

                // Create our Mocha instance
                const mocha = new Mocha({
                    timeout: testCase.timeout
                });
                // By default `require` caches files, making it impossible to require the same file multiple times.
                // Since we want to execute the same tests against many browsers we need to prevent this behaviour by
                // clearing the require cache.
                mocha.suite.on('require', (global, file) => {
                    delete require.cache[file];
                });

                // Just so we can see what tests are executed in the console.
                console.log(! browser.device
                    ? `Running ${testCase.file} against ${browser.browserName} (${browser.browser_version}) on ${browser.os} (${browser.os_version})`
                    : `Running ${testCase.file} on ${browser.device}`
                );

                mocha.addFile(`${testCase.file}`);
                mocha.suite.ctx.driver = driver

                const run = mocha.run()

                run
                    // Callback whenever a test fails.
                    .on('fail', test => reject(new Error(`Selenium test (${test.title}) failed.`)))
                    // When the test is over the Promise can be resolved.
                    .on('end', () => resolve());
            })
          );
    });
}

// starts the Local instance with the required arguments
bs_local.start(bs_local_args, () => {
  console.log("Started BrowserStackLocal");
  runner()
});
