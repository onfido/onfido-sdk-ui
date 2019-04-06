const path = require('path')
import {describe, it, instantiate} from '../utils/mochaw'

describe('Happy Paths', (driver, $) => {
  const [documentSelection, welcome, documentUpload] = instantiate('DocumentSelection', 'Welcome', 'DocumentUpload')(driver,$)

  it('should upload a file', async () => {
    console.log("testing")
    await driver.get('https://localhost:8080/')
    await welcome.primaryBtn.click()
    await documentSelection.passport.click()
    const input = await documentUpload.upload
    await input.sendKeys(path.join(__dirname,'../../features/helpers/resources/passport.jpg'))
    await driver.sleep(1000)
  })
})
