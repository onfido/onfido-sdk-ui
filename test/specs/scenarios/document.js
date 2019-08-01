import { describe, it } from '../../utils/mochaw'
import { localhostUrl } from '../../utils/config'
import {goToPassportUploadScreen, uploadFileAndClickConfirmButton} from './sharedFlows.js'

export const documentScenarios = (driver, screens, lang) => {
  const { welcome, documentSelector, documentUpload, documentUploadConfirmation, verificationComplete } = screens

  describe(`DOCUMENT UPLOAD in ${lang}`, () => {
    // all of these should be deleted!
    const documentUploadCopy = documentUpload.copy(lang)
    const documentUploadConfirmationCopy = documentUploadConfirmation.copy(lang)
    const verificationCompleteCopy = verificationComplete.copy(lang)

    it('should display cross device UI elements on doc upload screen', async () => {
      goToPassportUploadScreen(driver, screens, `?language=${lang}`)
      documentUpload.verifyCrossDeviceUIElements(documentUploadCopy)
    })

    it('should display uploader icon and button', async () => {
      goToPassportUploadScreen(driver, screens, `?language=${lang}`)
      documentUpload.verifyUploaderIcon(documentUploadCopy)
      documentUpload.verifyUploaderButton(documentUploadCopy)
    })

    it('should upload a passport and verify UI elements', async () => {
      goToPassportUploadScreen(driver, screens, `?language=${lang}`)

      documentUpload.verifyPassportTitle(documentUploadCopy)
      documentUpload.verifyPassportInstructionMessage(documentUploadCopy)
      documentUpload.getUploadInput()
      documentUpload.upload('passport.jpg')
      documentUploadConfirmation.verifyCheckReadabilityMessage(documentUploadConfirmationCopy)
      documentUploadConfirmation.verifyMakeSurePassportMessage(documentUploadConfirmationCopy)
    })

    it('should upload driving licence and verify UI elements', async () => {
      driver.get(localhostUrl + `?language=${lang}`)
      welcome.primaryBtn.click()
      documentSelector.drivingLicenceIcon.click()
      documentUpload.verifyFrontOfDrivingLicenceTitle(documentUploadCopy)
      documentUpload.verifyFrontOfDrivingLicenceInstructionMessage(documentUploadCopy)
      documentUpload.getUploadInput()
      documentUpload.upload('uk_driving_licence.png')
      documentUploadConfirmation.verifyCheckReadabilityMessage(documentUploadConfirmationCopy)
      documentUploadConfirmation.verifyMakeSureDrivingLicenceMessage(documentUploadConfirmationCopy)
      documentUploadConfirmation.confirmBtn.click()
      documentUpload.verifyBackOfDrivingLicenceTitle(documentUploadCopy)
      documentUpload.verifyBackOfDrivingLicenceInstructionMessage(documentUploadCopy)
      documentUpload.getUploadInput()
      documentUpload.upload('back_driving_licence.jpg')
      documentUploadConfirmation.verifyCheckReadabilityMessage(documentUploadConfirmationCopy)
      documentUploadConfirmation.verifyMakeSureDrivingLicenceMessage(documentUploadConfirmationCopy)
    })

    it('should upload identity card and verify UI elements', async () => {
      driver.get(localhostUrl + `?language=${lang}`)
      welcome.primaryBtn.click()
      documentSelector.identityCardIcon.click()
      documentUpload.verifyFrontOfIdentityCardTitle(documentUploadCopy)
      documentUpload.verifyFrontOfIdentityCardInstructionMessage(documentUploadCopy)
      uploadFileAndClickConfirmButton(screens, 'national_identity_card.jpg')
      documentUpload.verifyBackOfIdentityCardTitle(documentUploadCopy)
      documentUpload.verifyBackOfIdentityCardInstructionMessage(documentUploadCopy)
      documentUpload.getUploadInput()
      documentUpload.upload('back_national_identity_card.jpg')
      documentUploadConfirmation.verifyCheckReadabilityMessage(documentUploadConfirmationCopy)
      documentUploadConfirmation.verifyMakeSureIdentityCardMessage(documentUploadConfirmationCopy)
    })

    it('should return no document message after uploading non-doc image', async () => {
      goToPassportUploadScreen(driver, screens, `?language=${lang}`)
      uploadFileAndClickConfirmButton(screens, 'llama.pdf')
      documentUploadConfirmation.verifyNoDocumentError(documentUploadConfirmationCopy)
    })

    it('should upload a document on retry', async () => {
      goToPassportUploadScreen(driver, screens, `?language=${lang}`)
      uploadFileAndClickConfirmButton(screens, 'llama.pdf')
      documentUploadConfirmation.redoBtn.click()
      documentUpload.getUploadInput()
      documentUpload.upload('passport.jpg')
      documentUploadConfirmation.verifyCheckReadabilityMessage(documentUploadConfirmationCopy)
    })

    it('should return file size too large message for doc', async () => {
      goToPassportUploadScreen(driver, screens, `?language=${lang}`)
      documentUpload.getUploadInput()
      documentUpload.upload('over_10mb_face.jpg')
      documentUploadConfirmation.verifyFileSizeTooLargeError(documentUploadConfirmationCopy)
    })

    it('should return use another file type message', async () => {
      goToPassportUploadScreen(driver, screens, `?language=${lang}`)
      documentUpload.getUploadInput()
      documentUpload.upload('unsupported_file_type.txt')
      documentUploadConfirmation.verifyUseAnotherFileError(documentUploadConfirmationCopy)
    })

    it('should return glare detected message on front and back of doc', async () => {
      driver.get(localhostUrl + `?language=${lang}&async=false&useWebcam=false`)
      welcome.primaryBtn.click()
      documentSelector.drivingLicenceIcon.click()
      uploadFileAndClickConfirmButton(screens,'identity_card_with_glare.jpg')
      documentUploadConfirmation.verifyGlareDetectedWarning(documentUploadConfirmationCopy)
      documentUploadConfirmation.confirmBtn.click()
      uploadFileAndClickConfirmButton(screens,'identity_card_with_glare.jpg')
      documentUploadConfirmation.verifyGlareDetectedWarning(documentUploadConfirmationCopy)
    })

    it('should be able to retry document upload', async () => {
      goToPassportUploadScreen(`?language=${lang}&async=false&useWebcam=false`)
      documentUpload.getUploadInput()
      documentUpload.upload('passport.jpg')
      documentUploadConfirmation.redoBtn.click()
      uploadFileAndClickConfirmButton(screens,'passport.pdf')
      uploadFileAndClickConfirmButton(screens,'face.jpeg')
      verificationComplete.verifyUIElements(verificationCompleteCopy)
    })

    it('should be able to submit a document without seeing the document selector screen', async () => {
      driver.get(localhostUrl + `?language=${lang}&oneDoc=true&async=false&useWebcam=false`)
      welcome.primaryBtn.click(documentUploadCopy)
      documentUpload.verifyPassportTitle(documentUploadCopy)
      uploadFileAndClickConfirmButton(screens,'passport.jpg')
      uploadFileAndClickConfirmButton(screens,'face.jpeg')
      verificationComplete.verifyUIElements(verificationCompleteCopy)
    })
  })
}
