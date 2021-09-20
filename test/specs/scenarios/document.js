import { describe, it } from '../../utils/mochaw'
import { localhostUrl } from '../../main'
import {
  goToPassportUploadScreen,
  takePercySnapshot,
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

      it('should display document upload screen on desktop browsers when useLiveDocumentCapture is enabled @percy', async () => {
        goToPassportUploadScreen(
          driver,
          welcome,
          documentSelector,
          `?language=${lang}&useLiveDocumentCapture=true`
        )
        await takePercySnapshot(
          driver,
          `Verify Submit passport photo screen using LiveDocumentCapture=true ${lang}`
        )
        runThroughPassportUploadFlow()
        await takePercySnapshot(
          driver,
          `Verify Passport Check your image screen using LiveDocumentCapture=true ${lang}`
        )
      })

      it('should upload a passport and verify UI elements @percy', async () => {
        goToPassportUploadScreen(
          driver,
          welcome,
          documentSelector,
          `?language=${lang}`
        )
        await takePercySnapshot(
          driver,
          `Verify Submit passport photo screen ${lang}`
        )
        runThroughPassportUploadFlow()
        await takePercySnapshot(
          driver,
          `Verify Passport Check your image screen ${lang}`
        )
      })

      it('should upload driving licence and verify UI elements @percy', async () => {
        driver.get(baseUrl)
        welcome.continueToNextStep()
        documentSelector.clickOnDrivingLicenceIcon()
        await takePercySnapshot(
          driver,
          `Verify Select issuing country screen ${lang}`
        )
        countrySelector.selectSupportedCountry()
        await takePercySnapshot(
          driver,
          `Verify Select issuing country screen after country has been selected ${lang}`
        )
        countrySelector.clickSubmitDocumentButton()
        await takePercySnapshot(
          driver,
          `Verify Submit licence (front) screen ${lang}`
        )
        documentUpload.verifyFrontOfDrivingLicenceTitle(copy)
        documentUpload.verifyCrossDeviceUIElements(copy)
        documentUpload.verifyUploaderButton(copy)
        documentUpload.getUploadInput()
        documentUpload.upload('uk_driving_licence.png')
        await takePercySnapshot(
          driver,
          `Verify Check your image screen (front) for driving license ${lang}`
        )
        confirm.verifyCheckReadabilityMessage(copy)
        confirm.verifyMakeSureDrivingLicenceMessage(copy)
        confirm.clickConfirmButton()
        await takePercySnapshot(
          driver,
          `Verify Submit licence (back) screen ${lang}`
        )
        documentUpload.verifyBackOfDrivingLicenceTitle(copy)
        documentUpload.verifyCrossDeviceUIElements(copy)
        documentUpload.verifyUploaderButton(copy)
        documentUpload.getUploadInput()
        documentUpload.upload('back_driving_licence.jpg')
        await takePercySnapshot(
          driver,
          `Verify Check your image screen (back) for driving license ${lang}`
        )
        confirm.verifyCheckReadabilityMessage(copy)
        confirm.verifyMakeSureDrivingLicenceMessage(copy)
      })

      it('should upload identity card and verify UI elements @percy', async () => {
        driver.get(baseUrl)
        welcome.continueToNextStep()
        documentSelector.clickOnIdentityCardIcon()
        countrySelector.selectSupportedCountry()
        countrySelector.clickSubmitDocumentButton()
        await takePercySnapshot(
          driver,
          `Verify Submit identity card (front) screen ${lang}`
        )
        documentUpload.verifyFrontOfIdentityCardTitle(copy)
        documentUpload.verifyCrossDeviceUIElements(copy)
        documentUpload.verifyUploaderButton(copy)
        uploadFileAndClickConfirmButton(
          documentUpload,
          confirm,
          'national_identity_card.jpg'
        )
        //Need to have a test path where we can verify the Check your image for identity card
        await takePercySnapshot(
          driver,
          `Verify Submit identity card (back) screen ${lang}`
        )
        documentUpload.verifyBackOfIdentityCardTitle(copy)
        documentUpload.verifyCrossDeviceUIElements(copy)
        documentUpload.verifyUploaderButton(copy)
        documentUpload.getUploadInput()
        documentUpload.upload('back_national_identity_card.jpg')
        await takePercySnapshot(
          driver,
          `Verify Check your image screen for back of identity card after upload ${lang}`
        )
        confirm.verifyCheckReadabilityMessage(copy)
        confirm.verifyMakeSureIdentityCardMessage(copy)
      })

      it('should upload residence permit and verify UI elements @percy', async () => {
        driver.get(baseUrl)
        welcome.continueToNextStep()
        documentSelector.clickOnResidencePermitIcon()
        countrySelector.selectSupportedCountry()
        countrySelector.clickSubmitDocumentButton()
        await takePercySnapshot(
          driver,
          `Verify Submit residence permit (front) screen ${lang}`
        )
        documentUpload.verifyFrontOfResidencePermitTitle(copy)
        documentUpload.verifyCrossDeviceUIElements(copy)
        documentUpload.verifyUploaderButton(copy)
        uploadFileAndClickConfirmButton(
          documentUpload,
          confirm,
          'national_identity_card.jpg'
        )
        await takePercySnapshot(
          driver,
          `Verify Submit residence permit (back) screen ${lang}`
        )
        documentUpload.verifyBackOfResidencePermitTitle(copy)
        documentUpload.verifyCrossDeviceUIElements(copy)
        documentUpload.verifyUploaderButton(copy)
        documentUpload.getUploadInput()
        documentUpload.upload('national_identity_card.jpg')
        confirm.verifyCheckReadabilityMessage(copy)
        confirm.verifyMakeSureResidencePermitMessage(copy)
      })

      it('should return no document message after uploading non-doc image @percy', async () => {
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
        await takePercySnapshot(
          driver,
          `Verify No document detected message is displayed after uploading non-doc image ${lang}`
        )
      })

      it('should upload a document on retry after uploading a non-doc image @percy', async () => {
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
        await takePercySnapshot(
          driver,
          `Verify Upload passport photo screen is displayed ${lang}`
        )
        uploadPassportImageFile('passport.jpg')
        confirm.verifyCheckReadabilityMessage(copy)
      })

      it('should return file size too large message for PDF document upload @percy', async () => {
        goToPassportUploadScreen(
          driver,
          welcome,
          documentSelector,
          `?language=${lang}`
        )
        documentUpload.clickUploadButton()
        uploadPassportImageFile('sample-pdf-10-mb.pdf')
        confirm.verifyFileSizeTooLargeError(copy)
        await takePercySnapshot(
          driver,
          `Verify Upload passport photo screen shows "File size exceeded" message ${lang}`
        )
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

      it('should return image quality message on front of doc @percy', async () => {
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
        await takePercySnapshot(
          driver,
          `Verify "Cut-off image detected" message is seen ${lang}`
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
          confirm.verifyImageQualityMessage(copy, 'cut-off')
          confirm.clickRedoButton()
        })

        // 2nd retake
        it('should return a warning on the third attempt @percy', async () => {
          uploadFileAndClickConfirmButton(
            documentUpload,
            confirm,
            'identity_card_with_glare.jpg'
          )
          confirm.verifyImageQualityMessage(copy, 'glare')
          await takePercySnapshot(
            driver,
            `Verify "Glare detected message" is displayed with Upload anyway button ${lang}`
          )
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
        await takePercySnapshot(
          driver,
          `Verify Upload passport photo screen ${lang}`
        )
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

      it('should be able to retry document upload when using customized API requests feature and receiving an error response from the callback', async () => {
        goToPassportUploadScreen(
          driver,
          welcome,
          documentSelector,
          `?language=${lang}&useUploader=true&useCustomizedApiRequests=true&decoupleResponse=error`
        )
        documentUpload.clickUploadButton()
        uploadFileAndClickConfirmButton(
          documentUpload,
          confirm,
          'identity_card_with_glare.jpg'
        )
        confirm.verifyImageQualityMessage(copy, 'glare', 'error')
        confirm.clickRedoButton()
        uploadFileAndClickConfirmButton(
          documentUpload,
          confirm,
          'identity_card_with_glare.jpg'
        )
        confirm.verifyImageQualityMessage(copy, 'glare', 'error')
      })
    }
  )
}
