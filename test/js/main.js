//require("@babel/register");
const {Builder, By, until, Key} = require('selenium-webdriver');
const remote = require('selenium-webdriver/remote');
const browserstack = require('browserstack-local');
const path = require('path')

// Input capabilities
const capabilities = {
 'browserName' : 'IE',
 'browser_version' : '11.0',
 'os' : 'Windows',
 'os_version' : '10',
 'resolution' : '1024x768',
 'acceptSslCerts' : 'true',
 'browserstack.debug': "true",
  project: 'JS SDK',
 'browserstack.user' : process.env.BROWSERSTACK_USERNAME,
 'browserstack.key' : process.env.BROWSERSTACK_ACCESS_KEY,
 'browserstack.local' : 'true',
 'browserstack.localIdentifier' : 'Test123'
}

const $driver = driver => selector =>
  driver.findElement(By.css(selector))

const test = async () => {
  console.log("testing")
  let driver = new Builder()
    .usingServer('http://hub-cloud.browserstack.com/wd/hub')
    .withCapabilities(capabilities)
    .build();
  driver.setFileDetector(new remote.FileDetector);
  //let driver = await new Builder().forBrowser('firefox').build();

  const $ = $driver(driver)
  try {
    await driver.get('https://localhost:8080/')
    await $('.onfido-sdk-ui-Button-button').click()
    await $('.onfido-sdk-ui-DocumentSelector-icon-passport').click()
    const input = await $('.onfido-sdk-ui-CustomFileInput-input')
    await driver.executeScript(function(el) {
      el.setAttribute('style','display: block')
    },input)
    await input.sendKeys(path.join(__dirname,'../features/helpers/resources/passport.jpg'))
    await driver.sleep(1000)
  } finally {
    await driver.quit();
  }
}

const bs_local = new browserstack.Local();

// replace <browserstack-accesskey> with your key. You can also set an environment variable - "BROWSERSTACK_ACCESS_KEY".
const bs_local_args = {
  'key': capabilities['browserstack.key'],
  'localIdentifier' : capabilities['browserstack.localIdentifier'],
  'force': 'true'
};

// starts the Local instance with the required arguments
bs_local.start(bs_local_args, () => {
  console.log("Started BrowserStackLocal");
  test()
});
