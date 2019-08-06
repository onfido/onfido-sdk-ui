import { describe, it } from '../../utils/mochaw'
import { localhostUrl } from '../../config.json'
import { goToPassportUploadScreen, uploadFileAndClickConfirmButton } from './sharedFlows.js'

const options = {
  pageObjects: [
    'Welcome',
    'DocumentSelector',
    'DocumentUpload',
    'Confirm',
    'VerificationComplete',
    'BasePage'
  ]
}

export const documentScenarios = async (lang) => {
  describe(`DOCUMENT scenarios in ${lang}`, options, ({pageObjects, driver}) => {

    const {
      welcome,
      documentSelector,
      documentUpload,
      confirm,
      verificationComplete,
      basePage
    } = pageObjects
    const copy = basePage.copy(lang)

    it('should display cross device UI elements on doc upload screen', async () => {
      goToPassportUploadScreen(driver, welcome, documentSelector, `?language=${lang}`)
      documentUpload.verifyCrossDeviceUIElements(copy)
    })

    it('should display uploader icon and button', async () => {
      goToPassportUploadScreen(driver, welcome, documentSelector, `?language=${lang}`)
      documentUpload.verifyUploaderIcon(copy)
      documentUpload.verifyUploaderButton(copy)
    })

    it('should upload a passport and verify UI elements', async () => {
      goToPassportUploadScreen(driver, welcome, documentSelector, `?language=${lang}`)

      documentUpload.verifyPassportTitle(copy)
      documentUpload.verifyPassportInstructionMessage(copy)
      documentUpload.getUploadInput()
      documentUpload.upload('passport.jpg')
      confirm.verifyCheckReadabilityMessage(copy)
      confirm.verifyMakeSurePassportMessage(copy)
    })

    it('should upload driving licence and verify UI elements', async () => {
      driver.get(localhostUrl + `?language=${lang}`)
      welcome.primaryBtn.click()
      documentSelector.drivingLicenceIcon.click()
      documentUpload.verifyFrontOfDrivingLicenceTitle(copy)
      documentUpload.verifyFrontOfDrivingLicenceInstructionMessage(copy)
      documentUpload.getUploadInput()
      documentUpload.upload('uk_driving_licence.png')
      confirm.verifyCheckReadabilityMessage(copy)
      confirm.verifyMakeSureDrivingLicenceMessage(copy)
      confirm.confirmBtn.click()
      documentUpload.verifyBackOfDrivingLicenceTitle(copy)
      documentUpload.verifyBackOfDrivingLicenceInstructionMessage(copy)
      documentUpload.getUploadInput()
      documentUpload.upload('back_driving_licence.jpg')
      confirm.verifyCheckReadabilityMessage(copy)
      confirm.verifyMakeSureDrivingLicenceMessage(copy)
    })

    it('should upload identity card and verify UI elements', async () => {
      driver.get(localhostUrl + `?language=${lang}`)
      welcome.primaryBtn.click()
      documentSelector.identityCardIcon.click()
      documentUpload.verifyFrontOfIdentityCardTitle(copy)
      documentUpload.verifyFrontOfIdentityCardInstructionMessage(copy)
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'national_identity_card.jpg')
      documentUpload.verifyBackOfIdentityCardTitle(copy)
      documentUpload.verifyBackOfIdentityCardInstructionMessage(copy)
      documentUpload.getUploadInput()
      documentUpload.upload('back_national_identity_card.jpg')
      confirm.verifyCheckReadabilityMessage(copy)
      confirm.verifyMakeSureIdentityCardMessage(copy)
    })

    it('should return no document message after uploading non-doc image', async () => {
      goToPassportUploadScreen(driver, welcome, documentSelector, `?language=${lang}`)
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'llama.pdf')
      confirm.verifyNoDocumentError(copy)
    })

    it('should upload a document on retry', async () => {
      goToPassportUploadScreen(driver, welcome, documentSelector, `?language=${lang}`)
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'llama.pdf')
      confirm.redoBtn.click()
      documentUpload.getUploadInput()
      documentUpload.upload('passport.jpg')
      confirm.verifyCheckReadabilityMessage(copy)
    })

    it('should return file size too large message for doc', async () => {
      goToPassportUploadScreen(driver, welcome, documentSelector, `?language=${lang}`)
      documentUpload.getUploadInput()
      documentUpload.upload('over_10mb_face.jpg')
      confirm.verifyFileSizeTooLargeError(copy)
    })

    it('should return use another file type message', async () => {
      goToPassportUploadScreen(driver, welcome, documentSelector, `?language=${lang}`)
      documentUpload.getUploadInput()
      documentUpload.upload('unsupported_file_type.txt')
      confirm.verifyUseAnotherFileError(copy)
    })

    it('should return glare detected message on front and back of doc', async () => {
      driver.get(localhostUrl + `?language=${lang}&async=false&useWebcam=false`)
      welcome.primaryBtn.click()
      documentSelector.drivingLicenceIcon.click()
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'identity_card_with_glare.jpg')
      confirm.verifyGlareDetectedWarning(copy)
      confirm.confirmBtn.click()
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'identity_card_with_glare.jpg')
      confirm.verifyGlareDetectedWarning(copy)
    })

    it('should be able to retry document upload', async () => {
      goToPassportUploadScreen(driver, welcome, documentSelector, `?language=${lang}&async=false&useWebcam=false`)
      documentUpload.getUploadInput()
      documentUpload.upload('passport.jpg')
      confirm.redoBtn.click()
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'passport.pdf')
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'face.jpeg')
      verificationComplete.verifyUIElements(copy)
    })

    it('should be able to submit a document without seeing the document selector screen', async () => {
      driver.get(localhostUrl + `?language=${lang}&oneDoc=true&async=false&useWebcam=false`)
      welcome.primaryBtn.click(copy)
      documentUpload.verifyPassportTitle(copy)
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'passport.jpg')
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'face.jpeg')
      verificationComplete.verifyUIElements(copy)
    })
  })
}
