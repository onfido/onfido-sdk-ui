//require("@babel/register");
const {Builder, By, until, Key} = require('selenium-webdriver');

// Input capabilities
const capabilities = {
 'browserName' : 'Chrome',
 'browser_version' : '62.0',
 'os' : 'Windows',
 'os_version' : '10',
 'resolution' : '1024x768',
 'browserstack.debug': "true",
  project: 'JS SDK',
 'browserstack.user' : process.env.BROWSERSTACK_USERNAME,
 'browserstack.key' : process.env.BROWSERSTACK_ACCESS_KEY,
}

const test = async () => {
  console.log("testing")
  let driver = new Builder()
    .usingServer('http://hub-cloud.browserstack.com/wd/hub')
    .withCapabilities(capabilities)
    .build();
  //let driver = await new Builder().forBrowser('firefox').build();
  try {
    await driver.get('http://www.google.com/ncr');
    await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
    await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
  } finally {
    await driver.quit();
  }
}

test()
