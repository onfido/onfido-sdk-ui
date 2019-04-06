const path = require('path')
import {describe, it} from '../utils/mochaw.js'

describe('Happy Paths', (driver, $) => {
  it('should upload a file', async () => {
    console.log("testing")
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
})
