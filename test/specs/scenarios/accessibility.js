import { describe, it } from '../../utils/mochaw'
import { localhostUrl, testDeviceMobileNumber } from '../../config.json'
import {
  goToPassportUploadScreen,
  uploadFileAndClickConfirmButton,
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
        poaIntro.clickStartVerificationButton()
      }

      const goToCrossDeviceGetSecureLinkScreen = async () => {
        welcome.continueToNextStep()
        documentSelector.clickOnPassportIcon()
        documentUpload.switchToCrossDevice()
        crossDeviceIntro.continueToNextStep()
      }

      const goToCrossDeviceMobileConnectedScreen = async () => {
        documentUpload.switchToCrossDevice()
        crossDeviceIntro.continueToNextStep()
        crossDeviceLink.switchToCopyLinkOption()
        copyCrossDeviceLinkAndOpenInNewTab()
        switchBrowserTab(0)
      }

      const switchBrowserTab = async (tab) => {
        const browserWindows = driver.getAllWindowHandles()
        driver.switchTo().window(browserWindows[tab])
      }

      const copyCrossDeviceLinkAndOpenInNewTab = async () => {
        const crossDeviceLinkText = crossDeviceLink
          .copyLinkTextContainer()
          .getText()
        driver.executeScript("window.open('your url','_blank');")
        switchBrowserTab(1)
        driver.get(crossDeviceLinkText)
      }

      const waitForAlertToAppearAndSendSms = async () => {
        crossDeviceLink.clickOnSendLinkButton()
        driver.wait(until.alertIsPresent())
        driver.switchTo().alert().accept()
      }

      const runThroughCrossDeviceFlow = async () => {
        documentUpload.switchToCrossDevice()
        crossDeviceIntro.continueToNextStep()
        crossDeviceLink.switchToCopyLinkOption()
        copyCrossDeviceLinkAndOpenInNewTab()
        switchBrowserTab(0)
        crossDeviceMobileConnected.tipsHeader().isDisplayed()
        crossDeviceMobileConnected.verifyUIElements(copy)
        switchBrowserTab(1)
        driver.sleep(1000)
      }

      //Welcome
      it('should verify accessibility for the welcome screen', async () => {
        driver.get(baseUrl)
        runAccessibilityTest(driver)
      })

      it('should verify focus management for the welcome screen', async () => {
        driver.get(baseUrl)
        welcome.verifyFocusManagement()
      })

      //Cross Device Sync
      it('should verify accessibility for the cross device intro screen', async () => {
        driver.get(baseUrl)
        welcome.continueToNextStep()
        documentSelector.clickOnPassportIcon()
        documentUpload.switchToCrossDevice()
        runAccessibilityTest(driver)
      })

      it('should verify accessibility for the cross device screen', async () => {
        driver.get(baseUrl)
        goToCrossDeviceGetSecureLinkScreen()
        runAccessibilityTest(driver)
      })

      it('should verify accessibility for the cross device mobile connected screen', async () => {
        goToPassportUploadScreen(
          driver,
          welcome,
          documentSelector,
          `?language=${lang}&useUploader=true`
        )
        documentUpload.clickUploadButton()
        uploadFileAndClickConfirmButton(
          passportUploadImageGuide,
          confirm,
          'passport.jpg'
        )
        goToCrossDeviceMobileConnectedScreen()
        runAccessibilityTest(driver)
      })

      it('should verify accessibility for the cross device mobile notification sent screen', async () => {
        driver.get(baseUrl)
        goToCrossDeviceGetSecureLinkScreen()
        crossDeviceLink.switchToSendSmsOption()
        crossDeviceLink.typeMobileNumber(testDeviceMobileNumber)
        waitForAlertToAppearAndSendSms()
        runAccessibilityTest(driver)
      })

      // @FIXME: consistently fails due to accessibility test auto timing out
      it.skip('should verify accessibility for the cross device submit screen', async () => {
        goToPassportUploadScreen(
          driver,
          welcome,
          documentSelector,
          `?language=${lang}&useUploader=true`
        )
        documentUpload.clickUploadButton()
        uploadFileAndClickConfirmButton(
          passportUploadImageGuide,
          confirm,
          'passport.jpg'
        )
        runThroughCrossDeviceFlow()
        documentUpload.verifySelfieUploadTitle(copy)
        uploadFileAndClickConfirmButton(documentUpload, confirm, 'face.jpeg')
        crossDeviceClientSuccess.verifyUIElements(copy)
        switchBrowserTab(0)
        crossDeviceSubmit.documentUploadedMessage().isDisplayed()
        runAccessibilityTest(driver)
      })

      // Document Selector
      it('should verify accessibility for the document selector screen', async () => {
        driver.get(baseUrl)
        welcome.continueToNextStep()
        runAccessibilityTest(driver)
      })

      // Document Upload
      it('should verify accessibility for the passport upload image guide screen', async () => {
        goToPassportUploadScreen(
          driver,
          welcome,
          documentSelector,
          `?language=${lang}`
        )
        documentUpload.clickUploadButton()
        runAccessibilityTest(driver)
      })

      // @FIXME: Skip test for now as there is a bug in library reported here
      // https://github.com/alphagov/accessible-autocomplete/issues/361
      it.skip('should verify accessibility for the country selector screen', async () => {
        driver.get(baseUrl)
        welcome.continueToNextStep()
        documentSelector.clickOnIdentityCardIcon()
        runAccessibilityTest(driver)
      })

      it('should verify accessibility for the document uploader screen', async () => {
        driver.get(baseUrl)
        welcome.continueToNextStep()
        documentSelector.clickOnDrivingLicenceIcon()
        countrySelector.selectSupportedCountry()
        countrySelector.clickSubmitDocumentButton()
        runAccessibilityTest(driver)
      })

      it('should verify accessibility for the document upload confirmation screen', async () => {
        goToPassportUploadScreen(
          driver,
          welcome,
          documentSelector,
          `?language=${lang}`
        )
        documentUpload.clickUploadButton()
        passportUploadImageGuide.getUploadInput()
        passportUploadImageGuide.upload('passport.jpg')
        runAccessibilityTest(driver)
      })

      // Face
      it('should verify accessibility for the take a selfie screen', async () => {
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
          'passport.jpg'
        )
        runAccessibilityTest(driver)
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
        goToPassportUploadScreen(
          driver,
          welcome,
          documentSelector,
          `?language=${lang}&faceVideo=true`
        )
        driver.executeScript(
          'window.navigator.mediaDevices.enumerateDevices = () => Promise.resolve([{ kind: "video" }])'
        )
        documentUpload.clickUploadButton()
        uploadFileAndClickConfirmButton(
          passportUploadImageGuide,
          confirm,
          'passport.jpg'
        )
        faceVideoIntro.verifyUIElementsOnTheFaceVideoIntroScreen(copy)
        runAccessibilityTest(driver)
      })

      it('should verify accessibility for camera permission screen', async () => {
        goToPassportUploadScreen(
          driver,
          welcome,
          documentSelector,
          `?language=${lang}&faceVideo=true`
        )
        driver.executeScript(
          'window.navigator.mediaDevices.enumerateDevices = () => Promise.resolve([{ kind: "video" }])'
        )
        documentUpload.clickUploadButton()
        uploadFileAndClickConfirmButton(
          passportUploadImageGuide,
          confirm,
          'passport.jpg'
        )
        faceVideoIntro.verifyUIElementsOnTheFaceVideoIntroScreen(copy)
        faceVideoIntro.clickOnContinueButton()
        runAccessibilityTest(driver)
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
        documentUpload.verifyPassportTitle(copy)
        documentUpload.clickUploadButton()
        uploadFileAndClickConfirmButton(
          passportUploadImageGuide,
          confirm,
          'passport.jpg'
        )
        uploadFileAndClickConfirmButton(documentUpload, confirm, 'face.jpeg')
        runAccessibilityTest(driver)
      })

      //PoA
      it('should verify accessibility for PoA Intro screen', async () => {
        await driver.get(`${localhostUrl}?poa=true`)
        welcome.continueToNextStep()
        runAccessibilityTest(driver)
      })

      it('should verify accessibility for PoA Document Selection screen', async () => {
        goToPoADocumentSelectionScreen()
        runAccessibilityTest(driver)
      })

      it('should verify accessibility for PoA Document Guidance screen', async () => {
        goToPoADocumentSelectionScreen()
        poaDocumentSelection.clickOnBenefitsLetterIcon()
        runAccessibilityTest(driver)
      })

      //Modal
      it('should verify accessibility for modal screen', async () => {
        driver.get(`${baseUrl}&useModal=true`)
        welcome.clickOnOpenModalButton()
        runAccessibilityTest(driver)
      })
    }
  )
}
