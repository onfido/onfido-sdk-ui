import { describe, it } from '../../utils/mochaw'
import { testDeviceMobileNumber } from '../../config.json'
import { localhostUrl } from '../../main'
import {
  goToPassportUploadScreen,
  uploadFileAndClickConfirmButton,
  switchBrowserTab,
} from './sharedFlows.js'
import { runAccessibilityTest } from '../../utils/accessibility'
import { until } from 'selenium-webdriver'

const options = {
  pageObjects: [
    'Welcome',
    'Confirm',
    'DocumentSelector',
    'CountrySelector',
    'PassportUploadImageGuide',
    'DocumentUpload',
    'CrossDeviceClientSuccess',
    'CrossDeviceIntro',
    'CrossDeviceLink',
    'CrossDeviceMobileConnected',
    'CrossDeviceSubmit',
    'FaceVideoIntro',
    'PoaDocumentSelection',
    'PoaGuidance',
    'PoaIntro',
    'VerificationComplete',
    'BasePage',
  ],
}

export const accessibilityScenarios = async (lang = 'en_US') => {
  describe(
    `ACCESSIBILITY scenarios in ${lang}`,
    options,
    ({ driver, pageObjects }) => {
      const {
        welcome,
        confirm,
        documentSelector,
        countrySelector,
        passportUploadImageGuide,
        documentUpload,
        crossDeviceClientSuccess,
        crossDeviceIntro,
        crossDeviceLink,
        crossDeviceMobileConnected,
        crossDeviceSubmit,
        faceVideoIntro,
        poaDocumentSelection,
        poaIntro,
        basePage,
      } = pageObjects

      const baseUrl = `${localhostUrl}?language=${lang}`

      const copy = basePage.copy(lang)

      const goToPoADocumentSelectionScreen = async () => {
        driver.get(`${localhostUrl}?poa=true`)
        welcome.continueToNextStep()
        await poaIntro.clickStartVerificationButton()
      }

      const goToCrossDeviceGetSecureLinkScreen = async () => {
        welcome.continueToNextStep()
        await documentSelector.clickOnPassportIcon()
        await documentUpload.switchToCrossDevice()
        crossDeviceIntro.continueToNextStep()
      }

      const goToCrossDeviceMobileConnectedScreen = async () => {
        await documentUpload.switchToCrossDevice()
        crossDeviceIntro.continueToNextStep()
        await crossDeviceLink.switchToCopyLinkOption()
        await copyCrossDeviceLinkAndOpenInNewTab()
        await switchBrowserTab(0, driver)
      }

      const copyCrossDeviceLinkAndOpenInNewTab = async () => {
        const crossDeviceLinkText = crossDeviceLink
          .copyLinkTextContainer()
          .getText()
        driver.executeScript("window.open('your url','_blank');")
        await switchBrowserTab(1, driver)
        driver.get(crossDeviceLinkText)
      }

      const waitForAlertToAppearAndSendSms = async () => {
        await crossDeviceLink.clickOnSendLinkButton()
        driver.wait(until.alertIsPresent())
        await driver.switchTo().alert().accept()
      }

      const switchToCrossDeviceFlow = async () => {
        await documentUpload.switchToCrossDevice()
        crossDeviceIntro.continueToNextStep()
        await crossDeviceLink.switchToCopyLinkOption()
        await copyCrossDeviceLinkAndOpenInNewTab()
        await switchBrowserTab(0, driver)
        await crossDeviceMobileConnected.tipsHeader().isDisplayed()
        crossDeviceMobileConnected.verifyUIElements(copy)
        await switchBrowserTab(1, driver)
        driver.sleep(1000)
      }

      //Welcome
      it('should verify accessibility for the welcome screen', async () => {
        driver.get(baseUrl)
        await runAccessibilityTest(driver)
      })

      it('should verify focus management for the welcome screen', async () => {
        driver.get(baseUrl)
        await welcome.verifyFocusManagement()
      })

      //Cross Device Sync
      it('should verify accessibility for the cross device intro screen', async () => {
        driver.get(baseUrl)
        welcome.continueToNextStep()
        await documentSelector.clickOnPassportIcon()
        await documentUpload.switchToCrossDevice()
        await runAccessibilityTest(driver)
      })

      it('should verify accessibility for the cross device screen', async () => {
        driver.get(baseUrl)
        await goToCrossDeviceGetSecureLinkScreen()
        await runAccessibilityTest(driver)
      })

      it('should verify accessibility for the cross device mobile connected screen', async () => {
        await goToPassportUploadScreen(
          driver,
          welcome,
          documentSelector,
          `?language=${lang}`
        )
        await goToCrossDeviceMobileConnectedScreen()
        await runAccessibilityTest(driver)
      })

      it('should verify accessibility for the cross device mobile notification sent screen', async () => {
        driver.get(baseUrl)
        await goToCrossDeviceGetSecureLinkScreen()
        await crossDeviceLink.switchToSendSmsOption()
        await crossDeviceLink.typeMobileNumber(testDeviceMobileNumber)
        await waitForAlertToAppearAndSendSms()
        await runAccessibilityTest(driver)
      })

      it('should verify accessibility for the cross device submit screen', async () => {
        await goToPassportUploadScreen(
          driver,
          welcome,
          documentSelector,
          `?language=${lang}&useUploader=true`
        )
        await documentUpload.clickUploadButton()
        await uploadFileAndClickConfirmButton(
          passportUploadImageGuide,
          confirm,
          'passport.jpg'
        )
        await switchToCrossDeviceFlow()
        await documentUpload.verifySelfieUploadTitle(copy)
        await uploadFileAndClickConfirmButton(
          documentUpload,
          confirm,
          'face.jpeg'
        )
        crossDeviceClientSuccess.verifyUIElements(copy)
        await switchBrowserTab(0, driver)
        await crossDeviceSubmit.documentUploadedMessage().isDisplayed()
        await runAccessibilityTest(driver)
      })

      // Document Selector
      it('should verify accessibility for the document selector screen', async () => {
        driver.get(baseUrl)
        welcome.continueToNextStep()
        await runAccessibilityTest(driver)
      })

      // Document Upload
      it('should verify accessibility for the passport upload image guide screen', async () => {
        await goToPassportUploadScreen(
          driver,
          welcome,
          documentSelector,
          `?language=${lang}`
        )
        await documentUpload.clickUploadButton()
        await runAccessibilityTest(driver)
      })

      // @FIXME: Skip test for now as there is a bug in library reported here
      // https://github.com/alphagov/accessible-autocomplete/issues/361
      it.skip('should verify accessibility for the country selector screen', async () => {
        driver.get(baseUrl)
        welcome.continueToNextStep()
        await documentSelector.clickOnIdentityCardIcon()
        await runAccessibilityTest(driver)
      })

      it('should verify accessibility for the document uploader screen', async () => {
        driver.get(baseUrl)
        welcome.continueToNextStep()
        await documentSelector.clickOnDrivingLicenceIcon()
        await countrySelector.selectSupportedCountry()
        await countrySelector.clickSubmitDocumentButton()
        await runAccessibilityTest(driver)
      })

      it('should verify accessibility for the document upload confirmation screen', async () => {
        await goToPassportUploadScreen(
          driver,
          welcome,
          documentSelector,
          `?language=${lang}`
        )
        await documentUpload.clickUploadButton()
        await passportUploadImageGuide.getUploadInput()
        passportUploadImageGuide.upload('passport.jpg')
        await runAccessibilityTest(driver)
      })

      // Face
      it('should verify accessibility for the take a selfie screen', async () => {
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
          'passport.jpg'
        )
        await runAccessibilityTest(driver)
      })

      //FIXME: This is commented out due to the color-contrast accessibility rule fail - CX-4214.
      // it('should verify accessibility for the selfie confirmation screen', async () => {
      //   goToPassportUploadScreen(driver, welcome, documentSelector,`?language=${lang}`)
      //   documentUpload.clickUploadButton()
      //   uploadFileAndClickConfirmButton(passportUploadImageGuide, confirm, 'passport.jpg')
      //   camera.takeSelfie()
      //   confirm.confirmBtn().isDisplayed()
      //   runAccessibilityTest(driver)
      // })

      it('should verify accessibility for faceVideo intro screen', async () => {
        await goToPassportUploadScreen(
          driver,
          welcome,
          documentSelector,
          `?language=${lang}&faceVideo=true`
        )
        driver.executeScript(
          'window.navigator.mediaDevices.enumerateDevices = () => Promise.resolve([{ kind: "video" }])'
        )
        await documentUpload.clickUploadButton()
        await uploadFileAndClickConfirmButton(
          passportUploadImageGuide,
          confirm,
          'passport.jpg'
        )
        await faceVideoIntro.verifyUIElementsOnTheFaceVideoIntroScreen(copy)
        await runAccessibilityTest(driver)
      })

      it('should verify accessibility for camera permission screen', async () => {
        await goToPassportUploadScreen(
          driver,
          welcome,
          documentSelector,
          `?language=${lang}&faceVideo=true`
        )
        driver.executeScript(
          'window.navigator.mediaDevices.enumerateDevices = () => Promise.resolve([{ kind: "video" }])'
        )
        await documentUpload.clickUploadButton()
        await uploadFileAndClickConfirmButton(
          passportUploadImageGuide,
          confirm,
          'passport.jpg'
        )
        await faceVideoIntro.verifyUIElementsOnTheFaceVideoIntroScreen(copy)
        await faceVideoIntro.clickOnContinueButton()
        await runAccessibilityTest(driver)
      })

      //FIXME: This is commented out due to the color-contrast accessibility rule fail - CX-4214.
      // it('should verify accessibility for faceVideo recording and faceVideo confirmation screens', async () => {
      //   goToPassportUploadScreen(driver, welcome, documentSelector,`?language=${lang}&faceVideo=true`)
      //   driver.executeScript('window.navigator.mediaDevices.enumerateDevices = () => Promise.resolve([{ kind: "video" }])')
      //   documentUpload.clickUploadButton()
      //   uploadFileAndClickConfirmButton(passportUploadImageGuide, confirm, 'passport.jpg')
      //   faceVideoIntro.verifyUIElementsOnTheFaceVideoIntroScreen(copy)
      //   faceVideoIntro.clickOnContinueButton()
      //   camera.startVideoRecording()
      //   runAccessibilityTest(driver)
      //   camera.completeChallenges()
      //   runAccessibilityTest(driver)
      // })

      //Verification complete
      it('should verify accessibility for verification complete screen', async () => {
        await driver.get(`${baseUrl}&oneDoc=passport&useUploader=true`)
        welcome.continueToNextStep()
        await documentUpload.verifyPassportTitle(copy)
        await documentUpload.clickUploadButton()
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
        await runAccessibilityTest(driver)
      })

      //PoA
      it('should verify accessibility for PoA Intro screen', async () => {
        await driver.get(`${localhostUrl}?poa=true`)
        welcome.continueToNextStep()
        await runAccessibilityTest(driver)
      })

      it('should verify accessibility for PoA Document Selection screen', async () => {
        await goToPoADocumentSelectionScreen()
        await runAccessibilityTest(driver)
      })

      it('should verify accessibility for PoA Document Guidance screen', async () => {
        await goToPoADocumentSelectionScreen()
        await poaDocumentSelection.clickOnBenefitsLetterIcon()
        await runAccessibilityTest(driver)
      })

      //Modal
      it('should verify accessibility for modal screen', async () => {
        driver.get(`${baseUrl}&useModal=true`)
        await welcome.clickOnOpenModalButton()
        await runAccessibilityTest(driver)
      })
    }
  )
}
