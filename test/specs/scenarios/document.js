import { describe, it } from '../../utils/mochaw'
import { localhostUrl } from '../../utils/config'
import {goToPassportUploadScreen, uploadFileAndClickConfirmButton} from './sharedFlows.js'

export const documentScenarios = (driver, screens, lang) => {
  const {
    welcome,
    documentSelector,
    documentUpload,
    documentUploadConfirmation,
    verificationComplete,
    common
  } = screens
  const copy = common.copy(lang)

  describe(`DOCUMENT scenarios in ${lang}`, () => {
    it('should display cross device UI elements on doc upload screen', async () => {
      goToPassportUploadScreen(driver, screens, `?language=${lang}`)
      documentUpload.verifyCrossDeviceUIElements(copy)
    })

    it('should display uploader icon and button', async () => {
      goToPassportUploadScreen(driver, screens, `?language=${lang}`)
      documentUpload.verifyUploaderIcon(copy)
      documentUpload.verifyUploaderButton(copy)
    })

    it('should upload a passport and verify UI elements', async () => {
      goToPassportUploadScreen(driver, screens, `?language=${lang}`)

      documentUpload.verifyPassportTitle(copy)
      documentUpload.verifyPassportInstructionMessage(copy)
      documentUpload.getUploadInput()
      documentUpload.upload('passport.jpg')
      documentUploadConfirmation.verifyCheckReadabilityMessage(copy)
      documentUploadConfirmation.verifyMakeSurePassportMessage(copy)
    })

    it('should upload driving licence and verify UI elements', async () => {
      driver.get(localhostUrl + `?language=${lang}`)
      welcome.primaryBtn.click()
      documentSelector.drivingLicenceIcon.click()
      documentUpload.verifyFrontOfDrivingLicenceTitle(copy)
      documentUpload.verifyFrontOfDrivingLicenceInstructionMessage(copy)
      documentUpload.getUploadInput()
      documentUpload.upload('uk_driving_licence.png')
      documentUploadConfirmation.verifyCheckReadabilityMessage(copy)
      documentUploadConfirmation.verifyMakeSureDrivingLicenceMessage(copy)
      documentUploadConfirmation.confirmBtn.click()
      documentUpload.verifyBackOfDrivingLicenceTitle(copy)
      documentUpload.verifyBackOfDrivingLicenceInstructionMessage(copy)
      documentUpload.getUploadInput()
      documentUpload.upload('back_driving_licence.jpg')
      documentUploadConfirmation.verifyCheckReadabilityMessage(copy)
      documentUploadConfirmation.verifyMakeSureDrivingLicenceMessage(copy)
    })

    it('should upload identity card and verify UI elements', async () => {
      driver.get(localhostUrl + `?language=${lang}`)
      welcome.primaryBtn.click()
      documentSelector.identityCardIcon.click()
      documentUpload.verifyFrontOfIdentityCardTitle(copy)
      documentUpload.verifyFrontOfIdentityCardInstructionMessage(copy)
      uploadFileAndClickConfirmButton(screens, 'national_identity_card.jpg')
      documentUpload.verifyBackOfIdentityCardTitle(copy)
      documentUpload.verifyBackOfIdentityCardInstructionMessage(copy)
      documentUpload.getUploadInput()
      documentUpload.upload('back_national_identity_card.jpg')
      documentUploadConfirmation.verifyCheckReadabilityMessage(copy)
      documentUploadConfirmation.verifyMakeSureIdentityCardMessage(copy)
    })

    it('should return no document message after uploading non-doc image', async () => {
      goToPassportUploadScreen(driver, screens, `?language=${lang}`)
      uploadFileAndClickConfirmButton(screens, 'llama.pdf')
      documentUploadConfirmation.verifyNoDocumentError(copy)
    })

    it('should upload a document on retry', async () => {
      goToPassportUploadScreen(driver, screens, `?language=${lang}`)
      uploadFileAndClickConfirmButton(screens, 'llama.pdf')
      documentUploadConfirmation.redoBtn.click()
      documentUpload.getUploadInput()
      documentUpload.upload('passport.jpg')
      documentUploadConfirmation.verifyCheckReadabilityMessage(copy)
    })

    it('should return file size too large message for doc', async () => {
      goToPassportUploadScreen(driver, screens, `?language=${lang}`)
      documentUpload.getUploadInput()
      documentUpload.upload('over_10mb_face.jpg')
      documentUploadConfirmation.verifyFileSizeTooLargeError(copy)
    })

    it('should return use another file type message', async () => {
      goToPassportUploadScreen(driver, screens, `?language=${lang}`)
      documentUpload.getUploadInput()
      documentUpload.upload('unsupported_file_type.txt')
      documentUploadConfirmation.verifyUseAnotherFileError(copy)
    })

    it('should return glare detected message on front and back of doc', async () => {
      driver.get(localhostUrl + `?language=${lang}&async=false&useWebcam=false`)
      welcome.primaryBtn.click()
      documentSelector.drivingLicenceIcon.click()
      uploadFileAndClickConfirmButton(screens,'identity_card_with_glare.jpg')
      documentUploadConfirmation.verifyGlareDetectedWarning(copy)
      documentUploadConfirmation.confirmBtn.click()
      uploadFileAndClickConfirmButton(screens,'identity_card_with_glare.jpg')
      documentUploadConfirmation.verifyGlareDetectedWarning(copy)
    })

    it('should be able to retry document upload', async () => {
      goToPassportUploadScreen(driver, screens, `?language=${lang}&async=false&useWebcam=false`)
      documentUpload.getUploadInput()
      documentUpload.upload('passport.jpg')
      documentUploadConfirmation.redoBtn.click()
      uploadFileAndClickConfirmButton(screens,'passport.pdf')
      uploadFileAndClickConfirmButton(screens,'face.jpeg')
      verificationComplete.verifyUIElements(copy)
    })

    it('should be able to submit a document without seeing the document selector screen', async () => {
      driver.get(localhostUrl + `?language=${lang}&oneDoc=true&async=false&useWebcam=false`)
      welcome.primaryBtn.click(copy)
      documentUpload.verifyPassportTitle(copy)
      uploadFileAndClickConfirmButton(screens,'passport.jpg')
      uploadFileAndClickConfirmButton(screens,'face.jpeg')
      verificationComplete.verifyUIElements(copy)
    })
  })
}
