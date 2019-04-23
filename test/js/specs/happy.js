const path = require('path')
import {describe, it} from '../utils/mochaw'

const options = {
  pageObjects: ['DocumentSelection', 'Welcome', 'DocumentUpload']
}

describe('Happy Paths',options, ({driver,pageObjects}) => {
  const {documentSelection, welcome, documentUpload} = pageObjects

  it('should upload a file', async () => {
    console.log("testing")
    driver.get('https://localhost:8080/?async=false')
    welcome.getPrimaryBtn().click()
    documentSelection.getPassport().click()
    const input = documentUpload.getUploadInput()
    input.sendKeys(path.join(__dirname,'../../features/helpers/resources/passport.jpg'))
  })
})
