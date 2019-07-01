const expect = require('chai').expect
import { describe, it } from '../utils/mochaw'
import { runAccessibilityTest } from '../utils/accessibility'
const supportedLanguage = ["en", "es"]

const options = {
  pageObjects: ['DocumentSelection', 'Welcome', 'DocumentUpload', 'DocumentUploadConfirmation', 'VerificationComplete']
}

const localhostUrl = 'https://localhost:8080/'

describe('Happy Paths', options, ({driver, pageObjects}) => {
  const {documentSelection, welcome, documentUpload, documentUploadConfirmation, verificationComplete} = pageObjects

  describe('welcome screen', () => {
    supportedLanguage.forEach( (lang) => {
      it('should verify website title', async () => {
        driver.get(localhostUrl + `?language=${lang}`)
        const title = driver.getTitle()
        expect(title).to.equal('Onfido SDK Demo')
      })

      it('should verify UI elements on the welcome screen', async () => {
        driver.get(localhostUrl + `?language=${lang}`)
        const welcomeCopy = welcome.copy(lang)
        welcome.verifyTitle(welcomeCopy)
        welcome.verifySubtitle(welcomeCopy)
        welcome.verifyIdentityButton(welcomeCopy)
        welcome.verifyFooter(welcomeCopy)
      })

      it('should verify accessibility for the welcome screen', async () => {
        runAccessibilityTest(driver)
      })

      it('should verify focus management for the welcome screen', async () => {
        welcome.verifyFocusManagement()
      })
    })
  })

  describe('document selection screen', () => {

    supportedLanguage.forEach( (lang) => {

      it('should verify UI elements on the document selection screen', async () => {
        driver.get(localhostUrl + `?language=${lang}`)
        const documentSelectionCopy = documentSelection.copy(lang)
        welcome.primaryBtn.click()
        documentSelection.verifyDocumentSelectionScreenTitle(documentSelectionCopy)
        documentSelection.verifyDocumentSelectionScreenSubtitle(documentSelectionCopy)
        documentSelection.verifyDocumentSelectionScreenDocumentsLabels(documentSelectionCopy)
        documentSelection.verifyDocumentSelectionScreenDocumentsHints(documentSelectionCopy)
        documentSelection.verifyDocumentSelectionScreenDocumentsIcons(documentSelectionCopy)
      })
    })
  })

  describe('document upload screen', () => {
    const goToPassportUploadScreen = async (parameter='') => {

      driver.get(localhostUrl + parameter)
      welcome.primaryBtn.click()
      documentSelection.passportIcon.click()
    }

    const uploadFileAndClickConfirmButton = async (fileName) => {
      documentUpload.getUploadInput()
      documentUpload.upload(fileName)
      documentUploadConfirmation.confirmBtn.click()
    }

    const documentUploadCopy = documentUpload.copy()
    const documentUploadConfirmationCopy = documentUploadConfirmation.copy()
    const verificationCompleteCopy = verificationComplete.copy()

    it('should display cross device UI elements on doc upload screen', async () => {
      goToPassportUploadScreen()
      documentUpload.verifyCrossDeviceUIElements(documentUploadCopy)
    })

    it('should display uploader icon and button', async () => {
      goToPassportUploadScreen()
      documentUpload.verifyUploaderIcon(documentUploadCopy)
      documentUpload.verifyUploaderButton(documentUploadCopy)
    })

    it('should upload a passport and verify UI elements', async () => {
      goToPassportUploadScreen()

      documentUpload.verifyDocumentUploadScreenPassportTitle(documentUploadCopy)
      documentUpload.verifyDocumentUploadScreenPassportInstructionMessage(documentUploadCopy)
      documentUpload.getUploadInput()
      documentUpload.upload('passport.jpg')
      documentUploadConfirmation.verifyDocumentUploadScreenCheckReadabilityMessage(documentUploadConfirmationCopy)
      documentUploadConfirmation.verifyDocumentUploadScreenMakeSurePassportMessage(documentUploadConfirmationCopy)
    })

    it('should upload driving licence and verify UI elements', async () => {
      driver.get(localhostUrl)
      welcome.primaryBtn.click()
      documentSelection.drivingLicenceIcon.click()
      documentUpload.verifyDocumentUploadScreenFrontOfDrivingLicenceTitle(documentUploadCopy)
      documentUpload.verifyDocumentUploadScreenFrontInstructionMessage(documentUploadCopy)
      documentUpload.getUploadInput()
      documentUpload.upload('uk_driving_licence.png')
      documentUploadConfirmation.verifyDocumentUploadScreenCheckReadabilityMessage(documentUploadConfirmationCopy)
      documentUploadConfirmation.verifyDocumentUploadScreenMakeSureDrivingLicenceMessage(documentUploadConfirmationCopy)
      documentUploadConfirmation.confirmBtn.click()
      documentUpload.verifyDocumentUploadScreenBackOfDrivingLicenceTitle(documentUploadCopy)
      documentUpload.verifyDocumentUploadScreenBackInstructionMessage(documentUploadCopy)
      documentUpload.getUploadInput()
      documentUpload.upload('back_driving_licence.jpg')
      documentUploadConfirmation.verifyDocumentUploadScreenCheckReadabilityMessage(documentUploadConfirmationCopy)
      documentUploadConfirmation.verifyDocumentUploadScreenMakeSureDrivingLicenceMessage(documentUploadConfirmationCopy)
    })

    it('should upload identity card and verify UI elements', async () => {
      driver.get(localhostUrl)
      welcome.primaryBtn.click()
      documentSelection.identityCardIcon.click()
      documentUpload.verifyDocumentUploadScreenFrontOfIdentityCardTitle(documentUploadCopy)
      documentUpload.verifyDocumentUploadScreenFrontOfIdentityCardInstructionMessage(documentUploadCopy)
      uploadFileAndClickConfirmButton('national_identity_card.jpg')
      documentUpload.verifyDocumentUploadScreenBackOfIdentityCardTitle(documentUploadCopy)
      documentUpload.verifyDocumentUploadScreenBackOfIdentityCardInstructionMessage(documentUploadCopy)
      documentUpload.getUploadInput()
      documentUpload.upload('back_national_identity_card.jpg')
      documentUploadConfirmation.verifyDocumentUploadScreenCheckReadabilityMessage(documentUploadConfirmationCopy)
      documentUploadConfirmation.verifyDocumentUploadScreenMakeSureIdentityCardMessage(documentUploadConfirmationCopy)
    })

    it('should return no document message after uploading non-doc image', async () => {
      goToPassportUploadScreen()
      uploadFileAndClickConfirmButton('llama.pdf')
      documentUploadConfirmation.verifyNoDocumentError(documentUploadConfirmationCopy)
    })

    it('should upload a document after retrying', async () => {
      goToPassportUploadScreen()
      uploadFileAndClickConfirmButton('llama.pdf')
      documentUploadConfirmation.redoBtn.click()
      documentUpload.getUploadInput()
      documentUpload.upload('passport.jpg')
      documentUploadConfirmation.verifyDocumentUploadScreenCheckReadabilityMessage(documentUploadConfirmationCopy)
    })

    it('should return file size too large message for doc', async () => {
      goToPassportUploadScreen()
      documentUpload.getUploadInput()
      documentUpload.upload('over_10mb_face.jpg')
      documentUploadConfirmation.verifyFileSizeTooLargeError(documentUploadConfirmationCopy)
    })

    it('should return use another file type message', async () => {
      goToPassportUploadScreen()
      documentUpload.getUploadInput()
      documentUpload.upload('unsupported_file_type.txt')
      documentUploadConfirmation.verifyUseAnotherFileError(documentUploadConfirmationCopy)
    })

    it('should return unsupported file type error for selfie', async () => {
      goToPassportUploadScreen(`?async=false&language=&useWebcam=false`)
      uploadFileAndClickConfirmButton('passport.jpg')
      uploadFileAndClickConfirmButton('national_identity_card.pdf')
      documentUploadConfirmation.verifyUnsuppoertedFileError(documentUploadConfirmationCopy)
    })

    it('should upload selfie', async () => {
      goToPassportUploadScreen(`?async=false&language=&useWebcam=false`)
      uploadFileAndClickConfirmButton('passport.jpg')
      uploadFileAndClickConfirmButton('face.jpeg')
      verificationComplete.verifyVerificationCompleteScreenUIElements(verificationCompleteCopy)
    })

    it('should return no face found error for selfie', async () => {
      goToPassportUploadScreen(`?async=false&language=&useWebcam=false`)
      uploadFileAndClickConfirmButton('passport.jpg')
      uploadFileAndClickConfirmButton('llama.jpg')
      documentUploadConfirmation.verifyNoFaceError(documentUploadConfirmationCopy)
    })

    it('should return multiple faces error', async () => {
      goToPassportUploadScreen(`?async=false&language=&useWebcam=false`)
      uploadFileAndClickConfirmButton('passport.jpg')
      uploadFileAndClickConfirmButton('two_faces.jpg')
      documentUploadConfirmation.verifyMultipleFacesError(documentUploadConfirmationCopy)
    })

    it('should return glare detected message on front and back of doc', async () => {
      driver.get(localhostUrl + `?async=false&language=&useWebcam=false`)
      welcome.primaryBtn.click()
      documentSelection.drivingLicenceIcon.click()
      uploadFileAndClickConfirmButton('identity_card_with_glare.jpg')
      documentUploadConfirmation.verifyGlareDetectedWarning(documentUploadConfirmationCopy)
      documentUploadConfirmation.confirmBtn.click()
      uploadFileAndClickConfirmButton('identity_card_with_glare.jpg')
      documentUploadConfirmation.verifyGlareDetectedWarning(documentUploadConfirmationCopy)
    })

    it('should be able to retry document upload', async () => {
      goToPassportUploadScreen(`?async=false&language=&useWebcam=false`)
      documentUpload.getUploadInput()
      documentUpload.upload('passport.jpg')
      documentUploadConfirmation.redoBtn.click()
      uploadFileAndClickConfirmButton('passport.pdf')
      uploadFileAndClickConfirmButton('face.jpeg')
      verificationComplete.verifyVerificationCompleteScreenUIElements(verificationCompleteCopy)
    })
  })
})
