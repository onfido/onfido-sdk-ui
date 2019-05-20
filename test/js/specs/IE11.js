import {describe, it} from '../utils/mochaw'
const supportedLanguage = ["en", "es"]

const options = {
  pageObjects: ['DocumentSelection', 'Welcome', 'DocumentUpload', 'DocumentUploadConfirmation', 'VerificationComplete']
}

/* eslint-disable no-undef */
describe('Happy Paths', options, () => {
  const {documentUpload, documentUploadConfirmation, verificationComplete} = pageObjects

  supportedLanguage.forEach( (lang) => {
    it('should upload selfie', async () => {
      goToPassportUploadScreen(`?async=false&language=${lang}&useWebcam=false`)
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
