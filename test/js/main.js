//require("@babel/register");
const {Builder} = require('selenium-webdriver');
const remote = require('selenium-webdriver/remote');
const browserstack = require('browserstack-local');
const config = require('./config.json');
const Mocha = require('mocha');
const async = require('async');

const promisify = function(original) {
	return function (...args) {
		return new Promise((resolve, reject) => {
			args.push((err, result) => {
				if (err) {
					reject(err);
				} else {
					resolve(result);
				}
			});

			original.apply(this, args);
		});
	};
}

const eachP = promisify(async.each)

// ES5 native `Array.prototype.forEach` is not async; since tests are executed asynchronously we're going to need an
// async version of `forEach`
let asyncForEach = async (arr, cb) => {
    for (let i = 0; i < arr.length; i++) {
        await cb(arr[i], i, arr);
    }
};

// Input capabilities
const bsCapabilitiesDefault = {
  'acceptSslCerts' : 'true',
  'browserstack.debug': "true",
   project: 'JS SDK',
  'browserstack.user' : process.env.BROWSERSTACK_USERNAME,
  'browserstack.key' : process.env.BROWSERSTACK_ACCESS_KEY,
  'browserstack.local' : 'true'
}

// replace <browserstack-accesskey> with your key. You can also set an environment variable - "BROWSERSTACK_ACCESS_KEY".
const bs_local_args = {
  'key': bsCapabilitiesDefault['browserstack.key']
};


const currentDate = Date.now().toString();

const createBrowserStackLocal = async (localIdentifier) => new Promise((resolve, reject) => {
  const bs_local = new browserstack.Local();
  bs_local.start(
    Object.assign({
      localIdentifier
    }, bs_local_args),
    (error) => {
      if (error) reject()
      console.log("Started BrowserStackLocal");
      resolve(bs_local)
    });
})

const random = () => Math.random().toString(36).substring(7)

const createBrowser = async (browser, testCase) => {
  const localIdentifier = random();

  const bsLocal = await createBrowserStackLocal(localIdentifier)

  const bsConfig = Object.assign(bsCapabilitiesDefault, browser);
  const driver = await new Builder()
      .usingServer('http://hub-cloud.browserstack.com/wd/hub')
      .withCapabilities(Object.assign({
          name: testCase.file,
          build: currentDate,
          'browserstack.localIdentifier' : localIdentifier
      }, bsConfig))
      .build();
  driver.manage().setTimeouts({
    implicit: 3000
  })
  driver.setFileDetector(new remote.FileDetector);

  driver.finish = () => new Promise( async(resolve, reject) => {
    console.log("finishing browser")
    await driver.quit()
    bsLocal.stop( error => {
      if (error) reject(error)
      else resolve()
    })
  });

  return driver;
}

const createMocha = (driver, testCase) => {
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

  mocha.addFile(`${testCase.file}`);
  mocha.suite.ctx.driver = driver

  mocha.runP = () => new Promise(async (resolve) => {
    mocha.run()
        // When the test is over the Promise can be resolved.
        .on('end', resolve);
  })

  return mocha
}

const runner = async () => {
    // Iterate over all browsers.
    await eachP(config.browsers, async (browser) => {
        // Iterate over all tests.
        console.log("Browser:", browser.browserName)
        await asyncForEach(config.tests, async testCase => {
          const driver = await createBrowser(browser, testCase)
          const mocha = createMocha(driver, testCase)

          // Just so we can see what tests are executed in the console.
          console.log(! browser.device
              ? `Running ${testCase.file} against ${browser.browserName} (${browser.browser_version}) on ${browser.os} (${browser.os_version})`
              : `Running ${testCase.file} on ${browser.device}`
          );
          await mocha.runP()
          await driver.finish()
        });
    });
}

runner()


//ref: https://nehalist.io/selenium-tests-with-mocha-and-chai-in-javascript/
//ref: https://github.com/mochajs/mocha/wiki/Using-mocha-programmatically
