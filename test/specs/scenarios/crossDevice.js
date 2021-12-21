import { assert } from 'chai'
import { until } from 'selenium-webdriver'
import { describe, it } from '../../utils/mochaw'
import { testDeviceMobileNumber } from '../../config.json'
import { localhostUrl } from '../../main'
import {
  goToPassportUploadScreen,
  uploadFileAndClickConfirmButton,
  switchBrowserTab,
  takePercySnapshot,
} from './sharedFlows.js'

const options = {
  pageObjects: [
    'Welcome',
    'Confirm',
    'Camera',
    'DocumentSelector',
    'PassportUploadImageGuide',
    'DocumentUpload',
    'CrossDeviceClientIntro',
    'CrossDeviceClientSuccess',
    'CrossDeviceIntro',
    'CrossDeviceLink',
    'CrossDeviceMobileNotificationSent',
    'CrossDeviceMobileConnected',
    'CrossDeviceSubmit',
    'VerificationComplete',
    'SelfieIntro',
    'BasePage',
  ],
}

export const crossDeviceScenarios = async (lang) => {
  describe(
    `CROSS DEVICE scenarios in ${lang}`,
    options,
    ({ driver, pageObjects }) => {
      const {
        welcome,
        confirm,
        camera,
        documentSelector,
        passportUploadImageGuide,
        documentUpload,
        crossDeviceClientIntro,
        crossDeviceClientSuccess,
        crossDeviceIntro,
        crossDeviceLink,
        crossDeviceMobileNotificationSent,
        crossDeviceMobileConnected,
        crossDeviceSubmit,
        verificationComplete,
        selfieIntro,
        basePage,
      } = pageObjects

      const baseUrl = `${localhostUrl}?language=${lang}`

      const copy = basePage.copy(lang)

      const goToCrossDeviceScreen = async () => {
        welcome.continueToNextStep()
        await documentSelector.clickOnPassportIcon()
        await documentUpload.switchToCrossDevice()
        crossDeviceIntro.continueToNextStep()
      }

      const waitForAlertToAppearAndSendSms = async () => {
        await crossDeviceLink.clickOnSendLinkButton()
        driver.wait(until.alertIsPresent())
        await driver.switchTo().alert().accept()
      }

      const copyCrossDeviceLinkAndOpenInNewTab = async () => {
        const crossDeviceLinkText = crossDeviceLink
          .copyLinkTextContainer()
          .getText()
        driver.executeScript("window.open('your url','_blank');")
        await switchBrowserTab(1, driver)
        driver.get(crossDeviceLinkText)
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

      it('should verify UI elements on the cross device intro screen', async () => {
        driver.get(baseUrl)
        welcome.continueToNextStep()
        await documentSelector.clickOnPassportIcon()
        await documentUpload.switchToCrossDevice()
        crossDeviceIntro.verifyTitle(copy)
        await crossDeviceIntro.verifySubTitle(copy)
        await crossDeviceIntro.verifyIcons(copy)
        await crossDeviceIntro.verifyMessages(copy)
        await takePercySnapshot(driver, `Cross Device Intro screen ${lang}`)
      })

      it('should navigate to cross device when forceCrossDevice is enabled', async () => {
        driver.get(`${baseUrl}&forceCrossDevice=true`)
        welcome.continueToNextStep()
        await documentSelector.clickOnPassportIcon()
        crossDeviceIntro.verifyTitle(copy)
      })

      it('should display cross device intro screen if forceCrossDevice is enabled with useLiveDocumentCapture enabled also', async () => {
        await goToPassportUploadScreen(
          driver,
          welcome,
          documentSelector,
          `?language=${lang}&useLiveDocumentCapture=true&forceCrossDevice=true`
        )
        crossDeviceIntro.verifyTitle(copy)
      })

      it('should verify UI elements on the cross device link screen default QR code view', async () => {
        driver.get(baseUrl)
        await goToCrossDeviceScreen()
        crossDeviceLink.verifyTitle(copy)
        await crossDeviceLink.verifySubtitleQr(copy)
        assert.isTrue(
          crossDeviceLink.qrCode().isDisplayed(),
          'Test Failed: QR Code should be visible'
        )
        await crossDeviceLink.verifyQRCodeHelpToggleBtn(copy)
        crossDeviceLink.qrCodeHelpToggleBtn().click()
        assert.isTrue(
          crossDeviceLink.qrCodeHelpList().isDisplayed(),
          'Test Failed: QR Code help instructions should be visible'
        )
        await crossDeviceLink.verifyQRCodeHelpInstructions(copy)
        crossDeviceLink.qrCodeHelpToggleBtn().click()
        assert.isFalse(
          crossDeviceLink.qrCodeHelpList().isDisplayed(),
          'Test Failed: QR Code help instructions should be hidden'
        )
        await crossDeviceLink.verifyAlternativeMethodsSectionLabel(copy)
        await crossDeviceLink.verifySwitchToSmsOptionBtn(copy)
        await crossDeviceLink.verifySwitchToCopyLinkOptionBtn(copy)
        await takePercySnapshot(
          driver,
          `Cross Device - Get your secure link screen - QR code ${lang}`,
          {
            percyCSS: `div.onfido-sdk-ui-crossDevice-CrossDeviceLink-qrCodeContainer > svg { display: none; }`,
          }
        )
      })

      it('should verify UI elements on the cross device link screen SMS view', async () => {
        driver.get(baseUrl)
        await goToCrossDeviceScreen()
        crossDeviceLink.verifyTitle(copy)
        await crossDeviceLink.switchToSendSmsOption()
        await crossDeviceLink.expectCurrentUrlToMatchUrl(baseUrl)
        await crossDeviceLink.verifySubtitleSms(copy)
        await crossDeviceLink.verifyNumberInputLabel(copy)
        await crossDeviceLink.verifyNumberInput()
        await crossDeviceLink.verifySendLinkBtn(copy)
        await crossDeviceLink.verifyAlternativeMethodsSectionLabel(copy)
        await crossDeviceLink.verifySwitchToQrCodeOptionBtn(copy)
        await crossDeviceLink.verifySwitchToCopyLinkOptionBtn(copy)
        await takePercySnapshot(
          driver,
          `Cross Device - Get your secure link screen - Send link in SMS ${lang}`
        )
      })

      it('should verify UI elements on the cross device link screen copy link view', async () => {
        driver.get(baseUrl)
        await goToCrossDeviceScreen()
        crossDeviceLink.verifyTitle(copy)
        await crossDeviceLink.switchToCopyLinkOption()
        await crossDeviceLink.expectCurrentUrlToMatchUrl(baseUrl)
        await crossDeviceLink.verifySubtitleUrl(copy)
        await crossDeviceLink.verifyCopyLinkLabel(copy)
        await crossDeviceLink.verifyCopyToClipboardBtnLabel(copy)
        await crossDeviceLink.verifyCopyLinkTextContainer()
        await crossDeviceLink.verifyCopyLinkDivider()
        await crossDeviceLink.verifyAlternativeMethodsSectionLabel(copy)
        await crossDeviceLink.verifySwitchToQrCodeOptionBtn(copy)
        await crossDeviceLink.verifySwitchToSmsOptionBtn(copy)
        await takePercySnapshot(
          driver,
          `Cross Device - Get your secure link screen - Copy link ${lang}`,
          {
            percyCSS: `span.onfido-sdk-ui-crossDevice-CrossDeviceLink-linkText { display: none; }`,
          }
        )
      })

      it('should change the state of the copy to clipboard button after clicking', async () => {
        driver.get(baseUrl)
        await goToCrossDeviceScreen()
        await crossDeviceLink.switchToCopyLinkOption()
        crossDeviceLink.copyToClipboardBtn().click()
        await crossDeviceLink.verifyCopyToClipboardBtnChangedState(copy)
      })

      it('should display copy link view by default when excludeSmsCrossDeviceOption is enabled', async () => {
        driver.get(`${baseUrl}&excludeSmsCrossDeviceOption=true`)
        await goToCrossDeviceScreen()
        await crossDeviceLink.verifyCopyLinkLabel(copy)
        await crossDeviceLink.verifyCopyToClipboardBtnLabel(copy)
        await crossDeviceLink.verifyCopyLinkTextContainer()
        await crossDeviceLink.verifyCopyLinkDivider()
        await crossDeviceLink.verifyAlternativeMethodsSectionLabel(copy)
        await takePercySnapshot(
          driver,
          `Cross Device - Get your secure link screen configured to exclude "send SMS" option - copy link view ${lang}`,
          {
            percyCSS: `span.onfido-sdk-ui-crossDevice-CrossDeviceLink-linkText { display: none; }`,
          }
        )
        assert.isTrue(
          crossDeviceLink.alternativeMethodsSectionLabel().isDisplayed(),
          'Test Failed: Alternative methods section label should be displayed'
        )
        assert.isTrue(
          crossDeviceLink.isOptionBtnPresent('qr_code'),
          'Test Failed: QR code button should be displayed'
        )
        assert.isFalse(
          crossDeviceLink.isOptionBtnPresent('sms'),
          'Test Failed: SMS link button should not be displayed'
        )
      })

      it('should display SMS link view only and no alternative options when singleCrossDeviceOption is enabled', async () => {
        driver.get(`${baseUrl}&singleCrossDeviceOption=true`)
        await goToCrossDeviceScreen()
        await crossDeviceLink.verifySubtitleSms(copy)
        await crossDeviceLink.verifyNumberInputLabel(copy)
        await crossDeviceLink.verifyNumberInput()
        await crossDeviceLink.verifySendLinkBtn(copy)
        await takePercySnapshot(
          driver,
          `Cross Device - Get your secure link screen configured to only show Send SMS UI ${lang}`
        )
        assert.isFalse(
          crossDeviceLink.alternativeMethodOptionsSection().isDisplayed(),
          'Test Failed: Cross Device alternative methods section should not be displayed'
        )
      })

      it('should display default cross device QR code link view when given invalid alternative methods', async () => {
        driver.get(`${baseUrl}&invalidCrossDeviceAlternativeMethods=true`)
        await goToCrossDeviceScreen()
        crossDeviceLink.verifyTitle(copy)
        await crossDeviceLink.verifySubtitleQr(copy)
        assert.isTrue(
          crossDeviceLink.qrCode().isDisplayed(),
          'Test Failed: QR Code should be visible'
        )
        assert.isTrue(
          crossDeviceLink.alternativeMethodsSectionLabel().isDisplayed(),
          'Test Failed: Alternative methods section label should be displayed'
        )
        await crossDeviceLink.verifySwitchToSmsOptionBtn(copy)
        await crossDeviceLink.verifySwitchToCopyLinkOptionBtn(copy)
      })

      it('should display error when mobile number is not provided', async () => {
        driver.get(baseUrl)
        await goToCrossDeviceScreen()
        await crossDeviceLink.switchToSendSmsOption()
        await crossDeviceLink.typeMobileNumber('')
        await crossDeviceLink.clickOnSendLinkButton()
        await crossDeviceLink.verifyCheckNumberCorrectError(copy)
      })

      it('should display error when mobile number is wrong', async () => {
        driver.get(baseUrl)
        await goToCrossDeviceScreen()
        await crossDeviceLink.switchToSendSmsOption()
        await crossDeviceLink.typeMobileNumber('123456789')
        await crossDeviceLink.clickOnSendLinkButton()
        driver.sleep(500)
        await crossDeviceLink.verifyCheckNumberCorrectError(copy)
      })

      it('should display error when mobile number is possible but not a valid mobile number', async () => {
        driver.get(baseUrl)
        await goToCrossDeviceScreen()
        await crossDeviceLink.switchToSendSmsOption()
        await crossDeviceLink.selectCountryOption('HK')
        await crossDeviceLink.typeMobileNumber('99999999')
        await crossDeviceLink.clickOnSendLinkButton()
        driver.sleep(500)
        await crossDeviceLink.verifyCheckNumberCorrectError(copy)
      })

      it('should send sms and navigate to "Check your mobile" screen ', async () => {
        driver.get(baseUrl)
        driver.navigate().refresh()
        await goToCrossDeviceScreen()
        await crossDeviceLink.switchToSendSmsOption()
        await crossDeviceLink.typeMobileNumber(testDeviceMobileNumber)
        await waitForAlertToAppearAndSendSms()
        await crossDeviceMobileNotificationSent.verifyCheckYourMobilePhoneIcon()
        crossDeviceMobileNotificationSent.verifyTitle(copy)
        if (lang === 'en_US') {
          await crossDeviceMobileNotificationSent.verifySubmessage(
            'We’ve sent a secure link to +447495023357'
          )
        } else {
          await crossDeviceMobileNotificationSent.verifySubmessage(
            'Hemos enviado un enlace seguro a +447495023357'
          )
        }
        await crossDeviceMobileNotificationSent.verifyItMayTakeFewMinutesMessage(
          copy
        )
        await crossDeviceMobileNotificationSent.verifyTipsHeader(copy)
        await crossDeviceMobileNotificationSent.verifyTips(copy)
        await crossDeviceMobileNotificationSent.verifyResendLink(copy)
      })

      it('should be able to resend sms', async () => {
        driver.get(baseUrl)
        await goToCrossDeviceScreen()
        await crossDeviceLink.switchToSendSmsOption()
        await crossDeviceLink.typeMobileNumber(testDeviceMobileNumber)
        await waitForAlertToAppearAndSendSms()
        await crossDeviceMobileNotificationSent.verifyCheckYourMobilePhoneIcon()
        await crossDeviceMobileNotificationSent.clickResendLink()
        await crossDeviceLink.switchToSendSmsOption()
        await waitForAlertToAppearAndSendSms()
        await crossDeviceMobileNotificationSent.verifyCheckYourMobilePhoneIcon()
        crossDeviceMobileNotificationSent.verifyTitle(copy)
      })

      it('should verify UI elements on cross device mobile client intro screen @percy', async () => {
        driver.get(baseUrl)
        welcome.continueToNextStep()
        await documentSelector.clickOnPassportIcon()
        await switchToCrossDeviceFlow()
        crossDeviceClientIntro.verifyUIElements(copy)
        await takePercySnapshot(
          driver,
          `Cross Device Mobile Client Intro screen ${lang}`
        )
        // Need to switch back to original tab otherwise subsequent tests get stuck
        await switchBrowserTab(0, driver)
      })

      it('should verify all custom UI elements on customised cross device mobile client intro screen @percy', async () => {
        driver.get(
          `${baseUrl}&crossDeviceClientIntroCustomProductName=true&crossDeviceClientIntroCustomProductLogo=true`
        )
        welcome.continueToNextStep()
        await documentSelector.clickOnPassportIcon()
        await switchToCrossDeviceFlow()
        await crossDeviceClientIntro.verifySubTitleWithCustomText(copy)
        await crossDeviceClientIntro.customIcon().isDisplayed()
        await takePercySnapshot(
          driver,
          `Cross Device Mobile Client Intro screen (custom product text in subtitle, product logo)`
        )
        // Need to switch back to original tab otherwise subsequent tests get stuck
        await switchBrowserTab(0, driver)
      })

      it('should verify custom product name on customised cross device mobile client intro screen @percy', async () => {
        driver.get(`${baseUrl}&crossDeviceClientIntroCustomProductName=true`)
        welcome.continueToNextStep()
        await documentSelector.clickOnPassportIcon()
        await switchToCrossDeviceFlow()
        await crossDeviceClientIntro.verifySubTitleWithCustomText(copy)
        await crossDeviceClientIntro.icon().isDisplayed()
        // Need to switch back to original tab otherwise subsequent tests get stuck
        await switchBrowserTab(0, driver)
      })

      it('should verify custom product logo on customised cross device mobile client intro screen @percy', async () => {
        driver.get(`${baseUrl}&crossDeviceClientIntroCustomProductLogo=true`)
        welcome.continueToNextStep()
        await documentSelector.clickOnPassportIcon()
        await switchToCrossDeviceFlow()
        await crossDeviceClientIntro.verifySubTitle(copy)
        await crossDeviceClientIntro.customIcon().isDisplayed()
        // Need to switch back to original tab otherwise subsequent tests get stuck
        await switchBrowserTab(0, driver)
      })

      it('should successfully complete cross device e2e flow with selfie upload', async () => {
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
        await uploadFileAndClickConfirmButton(
          documentUpload,
          confirm,
          'face.jpeg'
        )
        crossDeviceClientSuccess.verifyUIElements(copy)
        await switchBrowserTab(0, driver)
        await crossDeviceSubmit.documentUploadedMessage().isDisplayed()
        crossDeviceSubmit.verifyUIElements(copy)
        await crossDeviceSubmit.clickOnSubmitVerificationButton()
        verificationComplete.verifyUIElements(copy)

        // TODO: Additionally check that the onComplete callback did get triggered by expecting the console.log is called with a string containing 'Complete with data! '
      })

      it('should succesfully complete cross device e2e flow with document and selfie upload', async () => {
        // FIXME: This & test above for E2E cross device flow with uploads excluded from automated E2E Prod tests
        //        as they consistently cause build to fail after 10ish minutes, but no issues running through manually.
        await goToPassportUploadScreen(
          driver,
          welcome,
          documentSelector,
          `?language=${lang}&useUploader=true`
        )
        await switchToCrossDeviceFlow()
        crossDeviceClientIntro.continueToNextStep()
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
        crossDeviceClientSuccess.verifyUIElements(copy)
        await switchBrowserTab(0, driver)
        driver.sleep(1000)
        await crossDeviceSubmit.documentUploadedMessage().isDisplayed()
        crossDeviceSubmit.verifyUIElements(copy)
        await crossDeviceSubmit.clickOnSubmitVerificationButton()
        verificationComplete.verifyUIElements(copy)
      })

      it.skip('should check Submit Verification button can only be clicked once when there is no Complete step', async () => {
        driver.get(`${baseUrl}&noCompleteStep=true`)
        welcome.continueToNextStep()
        await documentSelector.clickOnPassportIcon()
        await switchToCrossDeviceFlow()
        crossDeviceClientIntro.continueToNextStep()
        await documentUpload.clickUploadButton()
        await uploadFileAndClickConfirmButton(
          passportUploadImageGuide,
          confirm,
          'passport.jpg'
        )
        await selfieIntro.clickOnContinueButton()
        await camera.enableCameraAccessIfNecessary()
        camera.takeSelfie()
        await confirm.clickConfirmButton()
        crossDeviceClientSuccess.verifyUIElements(copy)
        await switchBrowserTab(0, driver)
        await crossDeviceSubmit.documentUploadedMessage().isDisplayed()
        await crossDeviceSubmit.clickOnSubmitVerificationButton()
        assert.isFalse(
          crossDeviceSubmit.submitVerificationButton().isEnabled(),
          'Test Failed: Submit Verification button should be disabled'
        )
      })

      it.skip('should complete cross device e2e flow with a US JWT', async () => {
        driver.get(`${baseUrl}&region=US`)
        welcome.continueToNextStep()
        await documentSelector.clickOnPassportIcon()
        await switchToCrossDeviceFlow()
        crossDeviceClientIntro.continueToNextStep()
        await documentUpload.clickUploadButton()
        await uploadFileAndClickConfirmButton(
          passportUploadImageGuide,
          confirm,
          'passport.jpg'
        )
        await selfieIntro.clickOnContinueButton()
        await camera.enableCameraAccessIfNecessary()
        camera.takeSelfie()
        await confirm.clickConfirmButton()
        crossDeviceClientSuccess.verifyUIElements(copy)
        await switchBrowserTab(0, driver)
        await crossDeviceSubmit.documentUploadedMessage().isDisplayed()
        await crossDeviceSubmit.clickOnSubmitVerificationButton()
        verificationComplete.verifyUIElements(copy)
      })

      it.skip('should hide logo on all screens when hideOnfidoLogo is enabled and given token has feature enabled', async () => {
        driver.get(`${baseUrl}&hideOnfidoLogo=true`)
        await welcome.checkLogoIsHidden()
        welcome.continueToNextStep()
        await documentSelector.checkLogoIsHidden()
        await documentSelector.clickOnPassportIcon()
        await switchToCrossDeviceFlow()
        await crossDeviceClientIntro.checkLogoIsHidden()
        crossDeviceClientIntro.continueToNextStep()
        await documentUpload.checkLogoIsHidden()
        await documentUpload.clickUploadButton()
        await uploadFileAndClickConfirmButton(
          passportUploadImageGuide,
          confirm,
          'passport.jpg'
        )
        await selfieIntro.checkLogoIsHidden()
        await selfieIntro.clickOnContinueButton()
        await camera.checkLogoIsHidden()
        await camera.enableCameraAccessIfNecessary()
        camera.takeSelfie()
        await confirm.checkLogoIsHidden()
        await confirm.clickConfirmButton()
        await crossDeviceClientSuccess.checkLogoIsHidden()
        await switchBrowserTab(0, driver)
        await crossDeviceSubmit.checkLogoIsHidden()
        await crossDeviceSubmit.clickOnSubmitVerificationButton()
        await verificationComplete.checkLogoIsHidden()
      })

      it.skip('should show the cobrand text and logo on all screens when showCobrand is enabled and token has feature enabled', async () => {
        driver.get(`${baseUrl}&showCobrand=true`)
        await welcome.checkCobrandIsVisible()
        welcome.continueToNextStep()
        await documentSelector.checkCobrandIsVisible()
        await documentSelector.clickOnPassportIcon()
        await switchToCrossDeviceFlow()
        await crossDeviceClientIntro.checkCobrandIsVisible()
        crossDeviceClientIntro.continueToNextStep()
        await documentUpload.checkCobrandIsVisible()
        await documentUpload.clickUploadButton()
        await uploadFileAndClickConfirmButton(
          passportUploadImageGuide,
          confirm,
          'passport.jpg'
        )
        await selfieIntro.checkCobrandIsVisible()
        await selfieIntro.clickOnContinueButton()
        await camera.checkCobrandIsVisible()
        await camera.enableCameraAccessIfNecessary()
        camera.takeSelfie()
        await confirm.checkCobrandIsVisible()
        await confirm.clickConfirmButton()
        await crossDeviceClientSuccess.checkCobrandIsVisible()
        await switchBrowserTab(0, driver)
        await crossDeviceSubmit.checkCobrandIsVisible()
        await crossDeviceSubmit.clickOnSubmitVerificationButton()
        await verificationComplete.checkCobrandIsVisible()
      })

      it.skip('should not show any logo, including cobrand text and logo on all screens when showCobrand is enabled but hideOnfidoLogo is also enabled', async () => {
        driver.get(`${baseUrl}&showCobrand=true&hideOnfidoLogo=true`)
        await welcome.checkLogoIsHidden()
        welcome.continueToNextStep()
        await documentSelector.checkLogoIsHidden()
        await documentSelector.clickOnPassportIcon()
        await switchToCrossDeviceFlow()
        await crossDeviceClientIntro.checkLogoIsHidden()
        crossDeviceClientIntro.continueToNextStep()
        await documentUpload.checkLogoIsHidden()
        await documentUpload.clickUploadButton()
        await uploadFileAndClickConfirmButton(
          passportUploadImageGuide,
          confirm,
          'passport.jpg'
        )
        await selfieIntro.checkLogoIsHidden()
        await selfieIntro.clickOnContinueButton()
        await camera.checkLogoIsHidden()
        await camera.enableCameraAccessIfNecessary()
        camera.takeSelfie()
        await confirm.checkLogoIsHidden()
        await confirm.clickConfirmButton()
        await crossDeviceClientSuccess.checkLogoIsHidden()
        await switchBrowserTab(0, driver)
        await crossDeviceSubmit.checkLogoIsHidden()
        await crossDeviceSubmit.clickOnSubmitVerificationButton()
        await verificationComplete.checkLogoIsHidden()
      })

      it.skip('should show the cobrand logo and Onfido logo on all screens when showLogoCobrand is enabled and token has feature enabled', async () => {
        driver.get(`${baseUrl}&showLogoCobrand=true`)
        await welcome.checkLogoCobrandIsVisible()
        welcome.continueToNextStep()
        await documentSelector.checkLogoCobrandIsVisible()
        await documentSelector.clickOnPassportIcon()
        await switchToCrossDeviceFlow()
        await crossDeviceClientIntro.checkLogoCobrandIsVisible()
        crossDeviceClientIntro.continueToNextStep()
        await documentUpload.checkLogoCobrandIsVisible()
        await documentUpload.clickUploadButton()
        await uploadFileAndClickConfirmButton(
          passportUploadImageGuide,
          confirm,
          'passport.jpg'
        )
        await selfieIntro.checkLogoCobrandIsVisible()
        await selfieIntro.clickOnContinueButton()
        await camera.checkLogoCobrandIsVisible()
        await camera.enableCameraAccessIfNecessary()
        camera.takeSelfie()
        await confirm.checkLogoCobrandIsVisible()
        await confirm.clickConfirmButton()
        await crossDeviceClientSuccess.checkLogoCobrandIsVisible()
        await switchBrowserTab(0, driver)
        await crossDeviceSubmit.checkLogoCobrandIsVisible()
        await crossDeviceSubmit.clickOnSubmitVerificationButton()
        await verificationComplete.checkLogoCobrandIsVisible()
      })
    }
  )
}
