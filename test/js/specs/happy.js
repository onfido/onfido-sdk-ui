const expect = require('chai').expect
import {describe, it} from '../utils/mochaw'
const supportedLanguage = ["en", "es"]

const options = {
  pageObjects: ['DocumentSelection', 'Welcome', 'DocumentUpload', 'DocumentUploadConfirmation', 'VerificationComplete']
}

const localhostUrl = 'https://localhost:8080/'

describe('Happy Paths', options, ({driver, pageObjects}) => {
  const {documentSelection, welcome, documentUpload, documentUploadConfirmation, verificationComplete} = pageObjects

  describe('welcome screen', function () {

    supportedLanguage.forEach( (lang) => {

    it('should verify website title', async () => {
      driver.get(localhostUrl + `?language=${lang}`)
      const title = driver.getTitle()
      expect(title).to.equal('Onfido SDK Demo')
    })

    it('should verify UI elements on the welcome screen', async () => {
      driver.get(localhostUrl + `?language=${lang}`)
      welcome.verifyWelcomeScreenTitle
      welcome.verifyWelcomeScreenSubitle
      welcome.verifyWelcomeScreenSubitle
      welcome.verifyIdentityButton
      welcome.verifyFooter
    })
  })
})

  describe('document selection screen', function () {

    supportedLanguage.forEach( (lang) => {

    it('should verify UI elements on the document selection screen', async () => {
      driver.get(localhostUrl + `?language=${lang}`)
      welcome.primaryBtn.click()
      documentSelection.verifyDocumentSelectionScreenTitle
      documentSelection.verifyDocumentSelectionScreenSubtitle
      documentSelection.verifyDocumentSelectionScreenDocumentsLabels
      documentSelection.verifyDocumentSelectionScreenDocumentsHints
      documentSelection.verifyDocumentSelectionScreenDocumentsIcons
    })
  })
})

  describe('document upload screen', function () {

    const goToPassportUploadScreen = async (parameter) => {
      if (typeof parameter === 'undefined') {
          parameter = ''
        }
      driver.get(localhostUrl + parameter)
      welcome.primaryBtn.click()
      documentSelection.passportIcon.click()
  }

    it('should display cross device UI elements on doc upload screen', async () => {
      goToPassportUploadScreen()
      documentUpload.verifyCrossDeviceUIElements
    })

    it('should display uploader icon and button', async () => {
      goToPassportUploadScreen()
      documentUpload.verifyUploaderIcon
      documentUpload.verifyUploaderButton
    })

    it('should upload a passport and verify UI elements', async () => {
      goToPassportUploadScreen()
      documentUpload.verifyDocumentUploadScreenPassportTitle
      documentUpload.verifyDocumentUploadScreenPassportInstructionMessage
      documentUpload.getUploadInput()
      documentUpload.upload('passport.jpg')
      documentUploadConfirmation.verifyDocumentUploadScreenCheckReadabilityMessage
      documentUploadConfirmation.verifyDocumentUploadScreenMakeSurePassportMessage
    })

    it('should upload driving licence and verify UI elements', async () => {
      driver.get(localhostUrl)
      welcome.primaryBtn.click()
      documentSelection.drivingLicenceIcon.click()
      documentUpload.verifyDocumentUploadScreenFrontOfDrivingLicenceTitle
      documentUpload.verifyDocumentUploadScreenFrontInstructionMessage
      documentUpload.getUploadInput()
      documentUpload.upload('uk_driving_licence.png')
      documentUploadConfirmation.verifyDocumentUploadScreenCheckReadabilityMessage
      documentUploadConfirmation.verifyDocumentUploadScreenMakeSureDrivingLicenceMessage
      documentUploadConfirmation.confirmBtn.click()
      documentUpload.verifyDocumentUploadScreenBackOfDrivingLicenceTitle
      documentUpload.verifyDocumentUploadScreenBackInstructionMessage
      documentUpload.getUploadInput()
      documentUpload.upload('back_driving_licence.jpg')
      documentUploadConfirmation.verifyDocumentUploadScreenCheckReadabilityMessage
      documentUploadConfirmation.verifyDocumentUploadScreenMakeSureDrivingLicenceMessage
    })

    it('should upload identity card and verify UI elements', async () => {
      driver.get(localhostUrl)
      welcome.primaryBtn.click()
      documentSelection.identityCardIcon.click()
      documentUpload.verifyDocumentUploadScreenIdentityCardTitle
      documentUpload.verifyDocumentUploadScreenFrontOfIdentityCardInstructionMessage
      documentUpload.getUploadInput()
      documentUpload.upload('national_identity_card.jpg')
      documentUploadConfirmation.confirmBtn.click()
      documentUpload.verifyDocumentUploadScreenBackOfIdentityCardTitle
      documentUpload.verifyDocumentUploadScreenBackOfIdentityCardInstructionMessage
      documentUpload.getUploadInput()
      documentUpload.upload('back_national_identity_card.jpg')
      documentUploadConfirmation.verifyDocumentUploadScreenCheckReadabilityMessage
      documentUploadConfirmation.verifyDocumentUploadScreenMakeSureIdentityCardMessage
    })

    it('should return no document message after uploading non-doc image', async () => {
      goToPassportUploadScreen()
      documentUpload.getUploadInput()
      documentUpload.upload('llama.pdf')
      documentUploadConfirmation.confirmBtn.click()
      documentUploadConfirmation.verifyNoDocumentError
    })

    it('should upload a document after retrying', async () => {
      goToPassportUploadScreen()
      documentUpload.getUploadInput()
      documentUpload.upload('llama.pdf')
      documentUploadConfirmation.confirmBtn.click()
      documentUploadConfirmation.redoBtn.click()
      documentUpload.getUploadInput()
      documentUpload.upload('passport.jpg')
      documentUploadConfirmation.verifyDocumentUploadScreenCheckReadabilityMessage
    })

    it('should return file size too large message for doc', async () => {
      goToPassportUploadScreen()
      documentUpload.getUploadInput()
      documentUpload.upload('over_10mb_face.jpg')
      documentUploadConfirmation.verifyFileSizeTooLargeError
    })

    it('should return use another file type message', async () => {
      goToPassportUploadScreen()
      documentUpload.getUploadInput()
      documentUpload.upload('unsupported_file_type.txt')
      documentUploadConfirmation.verifyUseAnotherFileError
    })

    it('should return unsupported file type error for selfie', async () => {
      goToPassportUploadScreen(`?async=false&language=&useWebcam=false`)
      documentUpload.getUploadInput()
      documentUpload.upload('passport.jpg')
      documentUploadConfirmation.confirmBtn.click()
      documentUpload.getUploadInput()
      documentUpload.upload('national_identity_card.pdf')
      documentUploadConfirmation.confirmBtn.click()
      documentUploadConfirmation.verifyUnsuppoertedFileError
    })

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

    it('should return no face found error for selfie', async () => {
      goToPassportUploadScreen(`?async=false&language=&useWebcam=false`)
      documentUpload.getUploadInput()
      documentUpload.upload('passport.jpg')
      documentUploadConfirmation.confirmBtn.click()
      documentUpload.getUploadInput()
      documentUpload.upload('llama.jpg')
      documentUploadConfirmation.confirmBtn.click()
      documentUploadConfirmation.verifyNoFaceError
    })

    it('should return multiple faces error', async () => {
      goToPassportUploadScreen(`?async=false&language=&useWebcam=false`)
      documentUpload.getUploadInput()
      documentUpload.upload('passport.jpg')
      documentUploadConfirmation.confirmBtn.click()
      documentUpload.getUploadInput()
      documentUpload.upload('two_faces.jpg')
      documentUploadConfirmation.confirmBtn.click()
      documentUploadConfirmation.verifyMultipleFacesError
    })

    it('should return glare detected message on front and back of doc', async () => {
      driver.get(localhostUrl + `?async=false&language=&useWebcam=false`)
      welcome.primaryBtn.click()
      documentSelection.drivingLicenceIcon.click()
      documentUpload.getUploadInput()
      documentUpload.upload('identity_card_with_glare.jpg')
      documentUploadConfirmation.confirmBtn.click()
      documentUploadConfirmation.verifyGlareDetectedWarning
      documentUploadConfirmation.confirmBtn.click()
      documentUpload.getUploadInput()
      documentUpload.upload('identity_card_with_glare.jpg')
      documentUploadConfirmation.confirmBtn.click()
      documentUploadConfirmation.verifyGlareDetectedWarning
    })

    it('should be able to retry document upload', async () => {
      goToPassportUploadScreen(`?async=false&language=&useWebcam=false`)
      documentUpload.getUploadInput()
      documentUpload.upload('passport.jpg')
      documentUploadConfirmation.redoBtn.click()
      documentUpload.getUploadInput()
      documentUpload.upload('passport.pdf')
      documentUploadConfirmation.confirmBtn.click()
      documentUpload.getUploadInput()
      documentUpload.upload('face.jpeg')
      documentUploadConfirmation.confirmBtn.click()
      verificationComplete.verifyVerificationCompleteScreenUIElements
    })
  })
})
