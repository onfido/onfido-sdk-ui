import {describe, it} from '../utils/mochaw'

const options = {
  pageObjects: ['DocumentSelector', 'Welcome', 'DocumentUpload']
}

const localhostUrl = 'https://localhost:8080/'

describe('Upload doc', options, ({driver, pageObjects}) => {
  const {documentSelector, welcome, documentUpload} = pageObjects

  const goToPassportUploadScreen = async (parameter='') => {
    driver.get(localhostUrl + parameter)
    welcome.primaryBtn.click()
    documentSelector.passportIcon.click()
  }

  it('should upload document on IE11 browser', async () => {
    goToPassportUploadScreen()
    documentUpload.getUploadInput()
    documentUpload.upload('passport.jpg')
  })

  it('should upload PDF on IE11 browser', async () => {
    goToPassportUploadScreen()
    documentUpload.getUploadInput()
    documentUpload.upload('national_identity_card.pdf')
  })
})
