const {By} = require('selenium-webdriver');
const path = require('path')

const $driver = driver => selector =>
  driver.findElement(By.css(selector))

describe('Happy Paths', () => {
  const driver = global.driver
  it('should upload a file', async () => {
    console.log("testing")
    const $ = $driver(driver)

    await driver.get('https://localhost:8080/')
    await $('.onfido-sdk-ui-Button-button').click()
    await $('.onfido-sdk-ui-DocumentSelector-icon-passport').click()
    const input = await $('.onfido-sdk-ui-CustomFileInput-input')
    await driver.executeScript(function(el) {
      el.setAttribute('style','display: block')
    },input)
    
    await input.sendKeys(path.join(__dirname,'../../features/helpers/resources/passport.jpg'))
    await driver.sleep(1000)
  })

  after(async () => driver.quit());
})
