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
    'CountrySelector',
    'PassportUploadImageGuide',
    'DocumentUpload',
    'Confirm',
    'VerificationComplete',
    'CrossDeviceIntro',
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
        countrySelector,
        passportUploadImageGuide,
        documentUpload,
        confirm,
        verificationComplete,
        crossDeviceIntro,
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
        countrySelector.selectSupportedCountry()
        countrySelector.clickSubmitDocumentButton()
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
        countrySelector.selectSupportedCountry()
        countrySelector.clickSubmitDocumentButton()
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

      it('should upload residence permit and verify UI elements', async () => {
        driver.get(baseUrl)
        welcome.continueToNextStep()
        documentSelector.clickOnResidencePermitIcon()
        countrySelector.selectSupportedCountry()
        countrySelector.clickSubmitDocumentButton()
        documentUpload.verifyFrontOfResidencePermitTitle(copy)
        documentUpload.verifyCrossDeviceUIElements(copy)
        documentUpload.verifyUploaderButton(copy)
        uploadFileAndClickConfirmButton(
          documentUpload,
          confirm,
          'national_identity_card.jpg'
        )
        documentUpload.verifyBackOfResidencePermitTitle(copy)
        documentUpload.verifyCrossDeviceUIElements(copy)
        documentUpload.verifyUploaderButton(copy)
        documentUpload.getUploadInput()
        documentUpload.upload('national_identity_card.jpg')
        confirm.verifyCheckReadabilityMessage(copy)
        confirm.verifyMakeSureResidencePermitMessage(copy)
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

      it('should upload a document on retry after uploading a non-doc image', async () => {
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

      it('should return file size too large message for PDF document upload', async () => {
        goToPassportUploadScreen(
          driver,
          welcome,
          documentSelector,
          `?language=${lang}`
        )
        documentUpload.clickUploadButton()
        uploadPassportImageFile('sample-pdf-10-mb.pdf')
        confirm.verifyFileSizeTooLargeError(copy)
      })

      it('should upload a resized document image if file size is too large message', async () => {
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
          'over_10mb_passport.jpg'
        )
        // Image is flagged for glare by back end,
        // i.e. resized image was successfully uploaded to back end as API cannot accept a file over 10MB
        confirm.verifyImageQualityMessage(copy, 'glare')
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

      it('should return image quality message on front of doc', async () => {
        driver.get(baseUrl)
        welcome.continueToNextStep()
        documentSelector.clickOnDrivingLicenceIcon()
        countrySelector.selectSupportedCountry()
        countrySelector.clickSubmitDocumentButton()
        // first upload attempt should return an error if image quality is detected
        // FIXME: Image quality errors are only returned for cut-off images in these tests!
        // We should be able to define the error type for each request
        uploadFileAndClickConfirmButton(
          documentUpload,
          confirm,
          'identity_card_with_cut-off.png'
        )
        confirm.verifyImageQualityMessage(copy, 'cut-off', 'error')
        confirm.clickRedoButton()

        // 1st retake
        it('should return an error on the second attempt', async () => {
          uploadFileAndClickConfirmButton(
            documentUpload,
            confirm,
            'identity_card_with_cut-off.png'
          )
          confirm.verifyImageQualityMessage(copy, 'cut-off', 'error')
          confirm.clickRedoButton()
        })

        // 2nd retake
        it('should return a warning on the third attempt', async () => {
          uploadFileAndClickConfirmButton(
            documentUpload,
            confirm,
            'identity_card_with_glare.jpg'
          )
          confirm.verifyImageQualityMessage(copy, 'glare')
          // Proceed all the way
          confirm.confirmBtn().isDisplayed()
          confirm.clickConfirmButton()
        })
      })

      it('should return image quality message on back of doc', async () => {
        driver.get(baseUrl)
        welcome.continueToNextStep()
        documentSelector.clickOnDrivingLicenceIcon()
        countrySelector.selectSupportedCountry()
        countrySelector.clickSubmitDocumentButton()
        uploadFileAndClickConfirmButton(
          documentUpload,
          confirm,
          'national_identity_card.jpg'
        )
        // first upload attempt should return an error if image quality is detected
        // FIXME: Image quality errors are only returned for cut-off images in these tests!
        // We should be able to define the error type for each request
        uploadFileAndClickConfirmButton(
          documentUpload,
          confirm,
          'identity_card_with_cut-off.png'
        )
        confirm.verifyImageQualityMessage(copy, 'cut-off', 'error')
        confirm.clickRedoButton()

        // 1st retake
        it('should return an error on the first retake attempt', async () => {
          uploadFileAndClickConfirmButton(
            documentUpload,
            confirm,
            'identity_card_with_cut-off.png'
          )
          confirm.verifyImageQualityMessage(copy, 'cut-off', 'error')
          confirm.clickRedoButton()
        })

        // 2nd retake
        it('should return a warning on the second retake attempt', async () => {
          uploadFileAndClickConfirmButton(
            documentUpload,
            confirm,
            'identity_card_with_cut-off_glare.png'
          )
          // Multiple image quality warnings, display by priority
          confirm.verifyImageQualityMessage(copy, 'cut-off')
          // Proceed all the way
          confirm.confirmBtn().isDisplayed()
          confirm.clickConfirmButton()
        })
      })

      it('should be able to retry document upload', async () => {
        goToPassportUploadScreen(
          driver,
          welcome,
          documentSelector,
          `?language=${lang}&useUploader=true`
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
        driver.get(`${baseUrl}&oneDoc=passport&useUploader=true`)
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

      it('should be taken to the cross-device flow for video capture if there is no camera and docVideo variant requested', async () => {
        driver.get(`${localhostUrl}?language=${lang}&docVideo=true`)
        driver.executeScript(
          'window.navigator.mediaDevices.enumerateDevices = () => Promise.resolve([])'
        )
        welcome.continueToNextStep()
        documentSelector.clickOnPassportIcon()
        crossDeviceIntro.verifyTitle(copy)
      })

      // @TODO: remove this test when we fully support docVideo variant for both desktop & mobile web
      it('should be taken to the cross-device flow for video capture docVideo variant requested', async () => {
        driver.get(`${localhostUrl}?language=${lang}&docVideo=true`)
        welcome.continueToNextStep()
        documentSelector.clickOnPassportIcon()
        crossDeviceIntro.verifyTitle(copy)
      })
    }
  )
}
