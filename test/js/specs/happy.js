const path = require('path')
import {describe, it} from '../utils/mochaw'

const options = {
  pageObjects: ['DocumentSelection', 'Welcome', 'DocumentUpload']
}

describe('Happy Paths',options, ({driver,pageObjects}) => {
  const {documentSelection, welcome, documentUpload} = pageObjects

  it('should upload a file', async () => {
    console.log("testing")
    await driver.get('https://localhost:8080/')
    await welcome.primaryBtn.click()
    await documentSelection.passport.click()
    const input = await documentUpload.upload
    await input.sendKeys(path.join(__dirname,'../../features/helpers/resources/passport.jpg'))
  })
})
