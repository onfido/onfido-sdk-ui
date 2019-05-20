const locale = (lang="en") => require(`../../../src/locales/${lang}.json`)
import {describe, it} from '../utils/mochaw'
const supportedLanguage = ["en", "es"]

const options = {
  pageObjects: ['DocumentSelection', 'Welcome', 'DocumentUpload', 'DocumentUploadConfirmation', 'VerificationComplete']
}

describe('Happy Paths', options, ({driver, pageObjects, until}) => {
  const {documentUpload, documentUploadConfirmation, verificationComplete} = pageObject

  supportedLanguage.forEach( (lang) => {
    it('should upload selfie', async () => {
      goToPassportUploadScreen(`?async=false&language=&useWebcam=false`)
      documentUpload.getUploadInput()
      documentUpload.upload('passport.jpg')
      documentUploadConfirmation.confirmBtn.click()
      documentUpload.getUploadInput()
      documentUpload.upload('face.jpeg')
      documentUploadConfirmation.confirmBtn.click()
      verificationComplete.verifyVerificationCompleteScreenUIElements
    })
  })
})
