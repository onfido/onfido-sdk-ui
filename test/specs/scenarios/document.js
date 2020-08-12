import { describe, it } from '../../utils/mochaw'
import { localhostUrl } from '../../config.json'
import {
  goToPassportUploadScreen,
  uploadFileAndClickConfirmButton,
} from './sharedFlows.js'

const options = {
  pageObjects: [
    'Welcome',
    'DocumentSelector',
    'PassportUploadImageGuide',
    'DocumentUpload',
    'Confirm',
    'VerificationComplete',
    'BasePage',
  ],
}

export const documentScenarios = async (lang) => {
  describe(
    `DOCUMENT scenarios in ${lang}`,
    options,
    ({ driver, pageObjects }) => {
      const {
        welcome,
        documentSelector,
        passportUploadImageGuide,
        documentUpload,
        confirm,
        verificationComplete,
        basePage,
      } = pageObjects

      const baseUrl = `${localhostUrl}?language=${lang}`

      const copy = basePage.copy(lang)

      const runThroughPassportUploadFlow = async () => {
        documentUpload.clickUploadButton()
        passportUploadImageGuide.verifyPassportGuideUIElements(copy)
        uploadPassportImageFile('passport.jpg')
        confirm.verifyCheckReadabilityMessage(copy)
        confirm.verifyMakeSurePassportMessage(copy)
      }

      const uploadPassportImageFile = async (filename) => {
        passportUploadImageGuide.getUploadInput()
        passportUploadImageGuide.upload(filename)
      }

      it('should display document upload screen on desktop browsers when useLiveDocumentCapture is enabled', async () => {
        goToPassportUploadScreen(
          driver,
          welcome,
          documentSelector,
          `?language=${lang}&useLiveDocumentCapture=true`
        )
        runThroughPassportUploadFlow()
      })

      it('should upload a passport and verify UI elements', async () => {
        goToPassportUploadScreen(
          driver,
          welcome,
          documentSelector,
          `?language=${lang}`
        )
        runThroughPassportUploadFlow()
      })

      it('should upload driving licence and verify UI elements', async () => {
        driver.get(baseUrl)
        welcome.continueToNextStep()
        documentSelector.clickOnDrivingLicenceIcon()
        documentUpload.verifyFrontOfDrivingLicenceTitle(copy)
        documentUpload.verifyCrossDeviceUIElements(copy)
        documentUpload.verifyUploaderButton(copy)
        documentUpload.getUploadInput()
        documentUpload.upload('uk_driving_licence.png')
        confirm.verifyCheckReadabilityMessage(copy)
        confirm.verifyMakeSureDrivingLicenceMessage(copy)
        confirm.clickConfirmButton()
        documentUpload.verifyBackOfDrivingLicenceTitle(copy)
        documentUpload.verifyCrossDeviceUIElements(copy)
        documentUpload.verifyUploaderButton(copy)
        documentUpload.getUploadInput()
        documentUpload.upload('back_driving_licence.jpg')
        confirm.verifyCheckReadabilityMessage(copy)
        confirm.verifyMakeSureDrivingLicenceMessage(copy)
      })

      it('should upload identity card and verify UI elements', async () => {
        driver.get(baseUrl)
        welcome.continueToNextStep()
        documentSelector.clickOnIdentityCardIcon()
        documentUpload.verifyFrontOfIdentityCardTitle(copy)
        documentUpload.verifyCrossDeviceUIElements(copy)
        documentUpload.verifyUploaderButton(copy)
        uploadFileAndClickConfirmButton(
          documentUpload,
          confirm,
          'national_identity_card.jpg'
        )
        documentUpload.verifyBackOfIdentityCardTitle(copy)
        documentUpload.verifyCrossDeviceUIElements(copy)
        documentUpload.verifyUploaderButton(copy)
        documentUpload.getUploadInput()
        documentUpload.upload('back_national_identity_card.jpg')
        confirm.verifyCheckReadabilityMessage(copy)
        confirm.verifyMakeSureIdentityCardMessage(copy)
      })

      it('should return no document message after uploading non-doc image', async () => {
        goToPassportUploadScreen(
          driver,
          welcome,
          documentSelector,
          `?language=${lang}`
        )
        documentUpload.clickUploadButton()
        uploadFileAndClickConfirmButton(
          passportUploadImageGuide,
          confirm,
          'llama.pdf'
        )
        confirm.verifyNoDocumentError(copy)
      })

      it('should upload a document on retry', async () => {
        goToPassportUploadScreen(
          driver,
          welcome,
          documentSelector,
          `?language=${lang}`
        )
        documentUpload.clickUploadButton()
        uploadFileAndClickConfirmButton(
          passportUploadImageGuide,
          confirm,
          'llama.pdf'
        )
        confirm.clickRedoButton()
        uploadPassportImageFile('passport.jpg')
        confirm.verifyCheckReadabilityMessage(copy)
      })

      it('should return file size too large message for doc', async () => {
        goToPassportUploadScreen(
          driver,
          welcome,
          documentSelector,
          `?language=${lang}`
        )
        documentUpload.clickUploadButton()
        uploadPassportImageFile('over_10mb_face.jpg')
        confirm.verifyFileSizeTooLargeError(copy)
      })

      it('should return "use another file type" message', async () => {
        goToPassportUploadScreen(
          driver,
          welcome,
          documentSelector,
          `?language=${lang}`
        )
        documentUpload.clickUploadButton()
        uploadPassportImageFile('unsupported_file_type.txt')
        confirm.verifyUseAnotherFileError(copy)
      })

      it('should return glare detected message on front and back of doc', async () => {
        driver.get(`${baseUrl}&async=false&useUploader=true`)
        welcome.continueToNextStep()
        documentSelector.clickOnDrivingLicenceIcon()
        uploadFileAndClickConfirmButton(
          documentUpload,
          confirm,
          'identity_card_with_glare.jpg'
        )
        confirm.verifyGlareDetectedWarning(copy)
        confirm.clickConfirmButton()
        uploadFileAndClickConfirmButton(
          documentUpload,
          confirm,
          'identity_card_with_glare.jpg'
        )
        confirm.verifyGlareDetectedWarning(copy)
      })

      it('should be able to retry document upload', async () => {
        goToPassportUploadScreen(
          driver,
          welcome,
          documentSelector,
          `?language=${lang}&async=false&useUploader=true`
        )
        documentUpload.clickUploadButton()
        uploadPassportImageFile('passport.jpg')
        confirm.clickRedoButton()
        uploadFileAndClickConfirmButton(
          passportUploadImageGuide,
          confirm,
          'passport.pdf'
        )
        uploadFileAndClickConfirmButton(documentUpload, confirm, 'face.jpeg')
        verificationComplete.verifyUIElements(copy)
      })

      it('should be able to submit a document without seeing the document selector screen', async () => {
        driver.get(`${baseUrl}&oneDoc=true&async=false&useUploader=true`)
        welcome.continueToNextStep(copy)
        documentUpload.verifyPassportTitle(copy)
        documentUpload.clickUploadButton()
        uploadFileAndClickConfirmButton(
          passportUploadImageGuide,
          confirm,
          'passport.jpg'
        )
        uploadFileAndClickConfirmButton(documentUpload, confirm, 'face.jpeg')
        verificationComplete.verifyUIElements(copy)
      })
    }
  )
}
