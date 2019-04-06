const {By} = require('selenium-webdriver');
const path = require('path')

const $driver = driver => selector =>
  driver.findElement(By.css(selector))

const wrap = fn => async done => {
  try {
    await fn(done);
  }
  catch (error) {
    done(error)
  }
}

describe('Happy Paths', function() {
  const driver = this.parent.ctx.driver

  it('should upload a file', wrap(async (done) => {
    console.log("testing", done)
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
  }))
})
