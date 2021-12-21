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
        await documentUpload.clickUploadButton()
        await passportUploadImageGuide.verifyPassportGuideUIElements(copy)
        await uploadPassportImageFile('passport.jpg')
        await confirm.verifyCheckReadabilityMessage(copy)
        await confirm.verifyMakeSurePassportMessage(copy)
      }

      const uploadPassportImageFile = async (filename) => {
        await passportUploadImageGuide.getUploadInput()
        passportUploadImageGuide.upload(filename)
      }

      it('should display document upload screen on desktop browsers when useLiveDocumentCapture is enabled @percy', async () => {
        await goToPassportUploadScreen(
          driver,
          welcome,
          documentSelector,
          `?language=${lang}&useLiveDocumentCapture=true`
        )
        await takePercySnapshot(
          driver,
          `Verify Submit passport photo screen using LiveDocumentCapture=true ${lang}`
        )
        await runThroughPassportUploadFlow()
        await takePercySnapshot(
          driver,
          `Verify Passport Check your image screen using LiveDocumentCapture=true ${lang}`
        )
      })

      it('should upload a passport and verify UI elements @percy', async () => {
        await goToPassportUploadScreen(
          driver,
          welcome,
          documentSelector,
          `?language=${lang}`
        )
        await takePercySnapshot(
          driver,
          `Verify Submit passport photo screen ${lang}`
        )
        await runThroughPassportUploadFlow()
        await takePercySnapshot(
          driver,
          `Verify Passport Check your image screen ${lang}`
        )
      })

      it('should upload driving licence and verify UI elements @percy', async () => {
        driver.get(baseUrl)
        welcome.continueToNextStep()
        await documentSelector.clickOnDrivingLicenceIcon()
        await takePercySnapshot(
          driver,
          `Verify Select issuing country screen ${lang}`
        )
        await countrySelector.selectSupportedCountry()
        await takePercySnapshot(
          driver,
          `Verify Select issuing country screen after country has been selected ${lang}`
        )
        await countrySelector.clickSubmitDocumentButton()
        await takePercySnapshot(
          driver,
          `Verify Submit licence (front) screen ${lang}`
        )
        await documentUpload.verifyFrontOfDrivingLicenceTitle(copy)
        await documentUpload.verifyCrossDeviceUIElements(copy)
        await documentUpload.verifyUploaderButton(copy)
        await documentUpload.getUploadInput()
        documentUpload.upload('uk_driving_licence.png')
        await takePercySnapshot(
          driver,
          `Verify Check your image screen (front) for driving license ${lang}`
        )
        await confirm.verifyCheckReadabilityMessage(copy)
        await confirm.verifyMakeSureDrivingLicenceMessage(copy)
        await confirm.clickConfirmButton()
        await takePercySnapshot(
          driver,
          `Verify Submit licence (back) screen ${lang}`
        )
        await documentUpload.verifyBackOfDrivingLicenceTitle(copy)
        await documentUpload.verifyCrossDeviceUIElements(copy)
        await documentUpload.verifyUploaderButton(copy)
        await documentUpload.getUploadInput()
        documentUpload.upload('back_driving_licence.jpg')
        await takePercySnapshot(
          driver,
          `Verify Check your image screen (back) for driving license ${lang}`
        )
        await confirm.verifyCheckReadabilityMessage(copy)
        await confirm.verifyMakeSureDrivingLicenceMessage(copy)
      })

      it('should upload identity card and verify UI elements @percy', async () => {
        driver.get(baseUrl)
        welcome.continueToNextStep()
        await documentSelector.clickOnIdentityCardIcon()
        await countrySelector.selectSupportedCountry()
        await countrySelector.clickSubmitDocumentButton()
        await takePercySnapshot(
          driver,
          `Verify Submit identity card (front) screen ${lang}`
        )
        await documentUpload.verifyFrontOfIdentityCardTitle(copy)
        await documentUpload.verifyCrossDeviceUIElements(copy)
        await documentUpload.verifyUploaderButton(copy)
        await uploadFileAndClickConfirmButton(
          documentUpload,
          confirm,
          'national_identity_card.jpg'
        )
        //Need to have a test path where we can verify the Check your image for identity card
        await takePercySnapshot(
          driver,
          `Verify Submit identity card (back) screen ${lang}`
        )
        await documentUpload.verifyBackOfIdentityCardTitle(copy)
        await documentUpload.verifyCrossDeviceUIElements(copy)
        await documentUpload.verifyUploaderButton(copy)
        await documentUpload.getUploadInput()
        documentUpload.upload('back_national_identity_card.jpg')
        await takePercySnapshot(
          driver,
          `Verify Check your image screen for back of identity card after upload ${lang}`
        )
        await confirm.verifyCheckReadabilityMessage(copy)
        await confirm.verifyMakeSureIdentityCardMessage(copy)
      })

      it('should upload residence permit and verify UI elements @percy', async () => {
        driver.get(baseUrl)
        welcome.continueToNextStep()
        await documentSelector.clickOnResidencePermitIcon()
        await countrySelector.selectSupportedCountry()
        await countrySelector.clickSubmitDocumentButton()
        await takePercySnapshot(
          driver,
          `Verify Submit residence permit (front) screen ${lang}`
        )
        await documentUpload.verifyFrontOfResidencePermitTitle(copy)
        await documentUpload.verifyCrossDeviceUIElements(copy)
        await documentUpload.verifyUploaderButton(copy)
        await uploadFileAndClickConfirmButton(
          documentUpload,
          confirm,
          'national_identity_card.jpg'
        )
        await takePercySnapshot(
          driver,
          `Verify Submit residence permit (back) screen ${lang}`
        )
        await documentUpload.verifyBackOfResidencePermitTitle(copy)
        await documentUpload.verifyCrossDeviceUIElements(copy)
        await documentUpload.verifyUploaderButton(copy)
        await documentUpload.getUploadInput()
        documentUpload.upload('national_identity_card.jpg')
        await confirm.verifyCheckReadabilityMessage(copy)
        await confirm.verifyMakeSureResidencePermitMessage(copy)
      })

      it('should return no document message after uploading non-doc image @percy', async () => {
        await goToPassportUploadScreen(
          driver,
          welcome,
          documentSelector,
          `?language=${lang}`
        )
        await documentUpload.clickUploadButton()
        await uploadFileAndClickConfirmButton(
          passportUploadImageGuide,
          confirm,
          'llama.pdf'
        )
        await confirm.verifyNoDocumentError(copy)
        await takePercySnapshot(
          driver,
          `Verify No document detected message is displayed after uploading non-doc image ${lang}`
        )
      })

      it('should upload a document on retry after uploading a non-doc image @percy', async () => {
        await goToPassportUploadScreen(
          driver,
          welcome,
          documentSelector,
          `?language=${lang}`
        )
        await documentUpload.clickUploadButton()
        await uploadFileAndClickConfirmButton(
          passportUploadImageGuide,
          confirm,
          'llama.pdf'
        )
        await confirm.clickRedoButton()
        await takePercySnapshot(
          driver,
          `Verify Upload passport photo screen is displayed ${lang}`
        )
        await uploadPassportImageFile('passport.jpg')
        await confirm.verifyCheckReadabilityMessage(copy)
      })

      it('should return file size too large message for PDF document upload @percy', async () => {
        await goToPassportUploadScreen(
          driver,
          welcome,
          documentSelector,
          `?language=${lang}`
        )
        await documentUpload.clickUploadButton()
        await uploadPassportImageFile('sample-pdf-10-mb.pdf')
        await confirm.verifyFileSizeTooLargeError(copy)
        await takePercySnapshot(
          driver,
          `Verify Upload passport photo screen shows "File size exceeded" message ${lang}`
        )
      })

      it('should upload a resized document image if file size is too large message', async () => {
        await goToPassportUploadScreen(
          driver,
          welcome,
          documentSelector,
          `?language=${lang}`
        )
        await documentUpload.clickUploadButton()
        await uploadFileAndClickConfirmButton(
          passportUploadImageGuide,
          confirm,
          'over_10mb_passport.jpg'
        )

        // Image is flagged for glare by back end,
        // i.e. resized image was successfully uploaded to back end as API cannot accept a file over 10MB
        await confirm.verifyImageQualityMessage(copy, 'glare')
      })

      it('should return "use another file type" message', async () => {
        await goToPassportUploadScreen(
          driver,
          welcome,
          documentSelector,
          `?language=${lang}`
        )
        await documentUpload.clickUploadButton()
        await uploadPassportImageFile('unsupported_file_type.txt')
        await confirm.verifyUseAnotherFileError(copy)
      })

      it('should return image quality message on front of doc @percy', async () => {
        driver.get(baseUrl)
        welcome.continueToNextStep()
        await documentSelector.clickOnDrivingLicenceIcon()
        await countrySelector.selectSupportedCountry()
        await countrySelector.clickSubmitDocumentButton()
        // first upload attempt should return an error if image quality is detected
        // FIXME: Image quality errors are only returned for cut-off images in these tests!
        // We should be able to define the error type for each request
        await uploadFileAndClickConfirmButton(
          documentUpload,
          confirm,
          'identity_card_with_cut-off.png'
        )
        await takePercySnapshot(
          driver,
          `Verify "Cut-off image detected" message is seen ${lang}`
        )
        await confirm.verifyImageQualityMessage(copy, 'cut-off', 'error')
        await confirm.clickRedoButton()

        // 1st retake
        it('should return an error on the second attempt', async () => {
          await uploadFileAndClickConfirmButton(
            documentUpload,
            confirm,
            'identity_card_with_cut-off.png'
          )
          await confirm.verifyImageQualityMessage(copy, 'cut-off')
          await confirm.clickRedoButton()
        })

        // 2nd retake
        it('should return a warning on the third attempt @percy', async () => {
          await uploadFileAndClickConfirmButton(
            documentUpload,
            confirm,
            'identity_card_with_glare.jpg'
          )
          await confirm.verifyImageQualityMessage(copy, 'glare')
          await takePercySnapshot(
            driver,
            `Verify "Glare detected message" is displayed with Upload anyway button ${lang}`
          )
          // Proceed all the way
          await confirm.confirmBtn().isDisplayed()
          await confirm.clickConfirmButton()
        })
      })

      it('should return image quality message on back of doc', async () => {
        driver.get(baseUrl)
        welcome.continueToNextStep()
        await documentSelector.clickOnDrivingLicenceIcon()
        await countrySelector.selectSupportedCountry()
        await countrySelector.clickSubmitDocumentButton()
        await uploadFileAndClickConfirmButton(
          documentUpload,
          confirm,
          'national_identity_card.jpg'
        )
        // first upload attempt should return an error if image quality is detected
        // FIXME: Image quality errors are only returned for cut-off images in these tests!
        // We should be able to define the error type for each request
        await uploadFileAndClickConfirmButton(
          documentUpload,
          confirm,
          'identity_card_with_cut-off.png'
        )
        await confirm.verifyImageQualityMessage(copy, 'cut-off', 'error')
        await confirm.clickRedoButton()

        // 1st retake
        it('should return an error on the first retake attempt', async () => {
          await uploadFileAndClickConfirmButton(
            documentUpload,
            confirm,
            'identity_card_with_cut-off.png'
          )
          await confirm.verifyImageQualityMessage(copy, 'cut-off', 'error')
          await confirm.clickRedoButton()
        })

        // 2nd retake
        it('should return a warning on the second retake attempt', async () => {
          await uploadFileAndClickConfirmButton(
            documentUpload,
            confirm,
            'identity_card_with_cut-off_glare.png'
          )
          // Multiple image quality warnings, display by priority
          await confirm.verifyImageQualityMessage(copy, 'cut-off')
          // Proceed all the way
          await confirm.confirmBtn().isDisplayed()
          await confirm.clickConfirmButton()
        })
      })

      it('should be able to retry document upload', async () => {
        await goToPassportUploadScreen(
          driver,
          welcome,
          documentSelector,
          `?language=${lang}&useUploader=true`
        )
        await documentUpload.clickUploadButton()
        await uploadPassportImageFile('passport.jpg')
        await confirm.clickRedoButton()
        await uploadFileAndClickConfirmButton(
          passportUploadImageGuide,
          confirm,
          'passport.pdf'
        )
        await uploadFileAndClickConfirmButton(
          documentUpload,
          confirm,
          'face.jpeg'
        )
        verificationComplete.verifyUIElements(copy)
      })

      it('should be able to submit a document without seeing the document selector screen', async () => {
        driver.get(`${baseUrl}&oneDoc=passport&useUploader=true`)
        welcome.continueToNextStep(copy)
        await documentUpload.verifyPassportTitle(copy)
        await documentUpload.clickUploadButton()
        await takePercySnapshot(
          driver,
          `Verify Upload passport photo screen ${lang}`
        )
        await uploadFileAndClickConfirmButton(
          passportUploadImageGuide,
          confirm,
          'passport.jpg'
        )
        await uploadFileAndClickConfirmButton(
          documentUpload,
          confirm,
          'face.jpeg'
        )
        verificationComplete.verifyUIElements(copy)
      })

      it('should be taken to the cross-device flow for video capture if there is no camera and docVideo variant requested', async () => {
        driver.get(`${localhostUrl}?language=${lang}&docVideo=true`)
        driver.executeScript(
          'window.navigator.mediaDevices.enumerateDevices = () => Promise.resolve([])'
        )
        welcome.continueToNextStep()
        await documentSelector.clickOnPassportIcon()
        crossDeviceIntro.verifyTitle(copy)
      })

      // @TODO: remove this test when we fully support docVideo variant for both desktop & mobile web
      it('should be taken to the cross-device flow for video capture docVideo variant requested', async () => {
        driver.get(`${localhostUrl}?language=${lang}&docVideo=true`)
        welcome.continueToNextStep()
        await documentSelector.clickOnPassportIcon()
        crossDeviceIntro.verifyTitle(copy)
      })

      it('should be able to retry document upload when using customized API requests feature and receiving an error response from the callback', async () => {
        await goToPassportUploadScreen(
          driver,
          welcome,
          documentSelector,
          `?language=${lang}&useUploader=true&useCustomizedApiRequests=true&decoupleResponse=error`
        )
        await documentUpload.clickUploadButton()
        await uploadFileAndClickConfirmButton(
          documentUpload,
          confirm,
          'identity_card_with_glare.jpg'
        )
        await confirm.verifyImageQualityMessage(copy, 'glare', 'error')
        await confirm.clickRedoButton()
        await uploadFileAndClickConfirmButton(
          documentUpload,
          confirm,
          'identity_card_with_glare.jpg'
        )
        await confirm.verifyImageQualityMessage(copy, 'glare', 'error')
      })
    }
  )
}
