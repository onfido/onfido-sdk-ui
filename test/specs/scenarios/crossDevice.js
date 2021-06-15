import { assert } from 'chai'
import { until } from 'selenium-webdriver'
import { describe, it } from '../../utils/mochaw'
import { localhostUrl, testDeviceMobileNumber } from '../../config.json'
import {
  goToPassportUploadScreen,
  uploadFileAndClickConfirmButton,
  switchBrowserTab,
} from './sharedFlows.js'

const options = {
  pageObjects: [
    'Welcome',
    'Confirm',
    'Camera',
    'DocumentSelector',
    'PassportUploadImageGuide',
    'DocumentUpload',
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
        documentSelector.clickOnPassportIcon()
        documentUpload.switchToCrossDevice()
        crossDeviceIntro.continueToNextStep()
      }

      const waitForAlertToAppearAndSendSms = async () => {
        crossDeviceLink.clickOnSendLinkButton()
        driver.wait(until.alertIsPresent())
        driver.switchTo().alert().accept()
      }

      const copyCrossDeviceLinkAndOpenInNewTab = async () => {
        const crossDeviceLinkText = crossDeviceLink
          .copyLinkTextContainer()
          .getText()
        driver.executeScript("window.open('your url','_blank');")
        switchBrowserTab(1, driver)
        driver.get(crossDeviceLinkText)
      }

      const runThroughCrossDeviceFlow = async () => {
        documentUpload.switchToCrossDevice()
        crossDeviceIntro.continueToNextStep()
        crossDeviceLink.switchToCopyLinkOption()
        copyCrossDeviceLinkAndOpenInNewTab()
        switchBrowserTab(0, driver)
        crossDeviceMobileConnected.tipsHeader().isDisplayed()
        crossDeviceMobileConnected.verifyUIElements(copy)
        switchBrowserTab(1, driver)
        driver.sleep(1000)
      }

      it('should verify UI elements on the cross device intro screen', async () => {
        driver.get(baseUrl)
        welcome.continueToNextStep()
        documentSelector.clickOnPassportIcon()
        documentUpload.switchToCrossDevice()
        crossDeviceIntro.verifyTitle(copy)
        crossDeviceIntro.verifySubTitle(copy)
        crossDeviceIntro.verifyIcons(copy)
        crossDeviceIntro.verifyMessages(copy)
      })

      it('should navigate to cross device when forceCrossDevice is enabled', async () => {
        driver.get(`${baseUrl}&forceCrossDevice=true`)
        welcome.continueToNextStep()
        documentSelector.clickOnPassportIcon()
        crossDeviceIntro.verifyTitle(copy)
      })

      it('should display cross device intro screen if forceCrossDevice is enabled with useLiveDocumentCapture enabled also', async () => {
        goToPassportUploadScreen(
          driver,
          welcome,
          documentSelector,
          `?language=${lang}&useLiveDocumentCapture=true&forceCrossDevice=true`
        )
        crossDeviceIntro.verifyTitle(copy)
      })

      it('should verify UI elements on the cross device link screen default QR code view ', async () => {
        driver.get(baseUrl)
        goToCrossDeviceScreen()
        crossDeviceLink.verifyTitle(copy)
        crossDeviceLink.verifySubtitleQr(copy)
        assert.isTrue(
          crossDeviceLink.qrCode().isDisplayed(),
          'Test Failed: QR Code should be visible'
        )
        crossDeviceLink.verifyQRCodeHelpToggleBtn(copy)
        crossDeviceLink.qrCodeHelpToggleBtn().click()
        assert.isTrue(
          crossDeviceLink.qrCodeHelpList().isDisplayed(),
          'Test Failed: QR Code help instructions should be visible'
        )
        crossDeviceLink.verifyQRCodeHelpInstructions(copy)
        crossDeviceLink.qrCodeHelpToggleBtn().click()
        assert.isFalse(
          crossDeviceLink.qrCodeHelpList().isDisplayed(),
          'Test Failed: QR Code help instructions should be hidden'
        )
        crossDeviceLink.verifySwitchToSmsOptionBtn(copy)
        crossDeviceLink.verifySwitchToCopyLinkOptionBtn(copy)
      })

      it('should verify UI elements on the cross device link screen SMS view', async () => {
        driver.get(baseUrl)
        goToCrossDeviceScreen()
        crossDeviceLink.verifyTitle(copy)
        crossDeviceLink.switchToSendSmsOption()
        crossDeviceLink.expectCurrentUrlToMatchUrl(baseUrl)
        crossDeviceLink.verifySubtitleSms(copy)
        crossDeviceLink.verifyNumberInputLabel(copy)
        crossDeviceLink.verifyNumberInput()
        crossDeviceLink.verifySendLinkBtn(copy)
        crossDeviceLink.verifySwitchToQrCodeOptionBtn(copy)
        crossDeviceLink.verifySwitchToCopyLinkOptionBtn(copy)
      })

      it('should verify UI elements on the cross device link screen copy link view', async () => {
        driver.get(baseUrl)
        goToCrossDeviceScreen()
        crossDeviceLink.verifyTitle(copy)
        crossDeviceLink.switchToCopyLinkOption()
        crossDeviceLink.expectCurrentUrlToMatchUrl(baseUrl)
        crossDeviceLink.verifySubtitleUrl(copy)
        crossDeviceLink.verifyCopyLinkInsteadLabel(copy)
        crossDeviceLink.verifyCopyToClipboardBtn(copy)
        crossDeviceLink.verifyCopyLinkTextContainer()
        crossDeviceLink.verifyDivider()
        crossDeviceLink.verifySwitchToQrCodeOptionBtn(copy)
        crossDeviceLink.verifySwitchToSmsOptionBtn(copy)
      })

      it('should change the state of the copy to clipboard button after clicking', async () => {
        driver.get(baseUrl)
        goToCrossDeviceScreen()
        crossDeviceLink.switchToCopyLinkOption()
        crossDeviceLink.copyToClipboardBtn().click()
        crossDeviceLink.verifyCopyToClipboardBtnChangedState(copy)
      })

      it('should display error when mobile number is not provided', async () => {
        driver.get(baseUrl)
        goToCrossDeviceScreen()
        crossDeviceLink.switchToSendSmsOption()
        crossDeviceLink.typeMobileNumber('')
        crossDeviceLink.clickOnSendLinkButton()
        crossDeviceLink.verifyCheckNumberCorrectError(copy)
      })

      it('should display error when mobile number is wrong', async () => {
        driver.get(baseUrl)
        goToCrossDeviceScreen()
        crossDeviceLink.switchToSendSmsOption()
        crossDeviceLink.typeMobileNumber('123456789')
        crossDeviceLink.clickOnSendLinkButton()
        driver.sleep(500)
        crossDeviceLink.verifyCheckNumberCorrectError(copy)
      })

      it('should display error when mobile number is possible but not a valid mobile number', async () => {
        driver.get(baseUrl)
        goToCrossDeviceScreen()
        crossDeviceLink.switchToSendSmsOption()
        crossDeviceLink.selectCountryOption('HK')
        crossDeviceLink.typeMobileNumber('99999999')
        crossDeviceLink.clickOnSendLinkButton()
        driver.sleep(500)
        crossDeviceLink.verifyCheckNumberCorrectError(copy)
      })

      it('should send sms and navigate to "Check your mobile" screen ', async () => {
        driver.get(baseUrl)
        driver.navigate().refresh()
        goToCrossDeviceScreen()
        crossDeviceLink.switchToSendSmsOption()
        crossDeviceLink.typeMobileNumber(testDeviceMobileNumber)
        waitForAlertToAppearAndSendSms()
        crossDeviceMobileNotificationSent.verifyCheckYourMobilePhoneIcon()
        crossDeviceMobileNotificationSent.verifyTitle(copy)
        if (lang === 'en_US') {
          crossDeviceMobileNotificationSent.verifySubmessage(
            'We’ve sent a secure link to +447495023357'
          )
        } else {
          crossDeviceMobileNotificationSent.verifySubmessage(
            'Hemos enviado un enlace seguro a +447495023357'
          )
        }
        crossDeviceMobileNotificationSent.verifyItMayTakeFewMinutesMessage(copy)
        crossDeviceMobileNotificationSent.verifyTipsHeader(copy)
        crossDeviceMobileNotificationSent.verifyTips(copy)
        crossDeviceMobileNotificationSent.verifyResendLink(copy)
      })

      it('should be able to resend sms', async () => {
        driver.get(baseUrl)
        goToCrossDeviceScreen()
        crossDeviceLink.switchToSendSmsOption()
        crossDeviceLink.typeMobileNumber(testDeviceMobileNumber)
        waitForAlertToAppearAndSendSms()
        crossDeviceMobileNotificationSent.verifyCheckYourMobilePhoneIcon()
        crossDeviceMobileNotificationSent.clickResendLink()
        crossDeviceLink.switchToSendSmsOption()
        waitForAlertToAppearAndSendSms()
        crossDeviceMobileNotificationSent.verifyCheckYourMobilePhoneIcon()
        crossDeviceMobileNotificationSent.verifyTitle(copy)
      })

      it('should succesfully complete cross device e2e flow with selfie upload', async () => {
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
        switchBrowserTab(0, driver)
        crossDeviceSubmit.documentUploadedMessage().isDisplayed()
        crossDeviceSubmit.verifyUIElements(copy)
        crossDeviceSubmit.clickOnSubmitVerificationButton()
        verificationComplete.verifyUIElements(copy)
      })

      it('should succesfully complete cross device e2e flow with document and selfie upload', async () => {
        goToPassportUploadScreen(
          driver,
          welcome,
          documentSelector,
          `?language=${lang}&useUploader=true`
        )
        runThroughCrossDeviceFlow()
        documentUpload.clickUploadButton()
        uploadFileAndClickConfirmButton(
          passportUploadImageGuide,
          confirm,
          'passport.jpg'
        )
        uploadFileAndClickConfirmButton(documentUpload, confirm, 'face.jpeg')
        crossDeviceClientSuccess.verifyUIElements(copy)
        switchBrowserTab(0, driver)
        driver.sleep(1000)
        crossDeviceSubmit.documentUploadedMessage().isDisplayed()
        crossDeviceSubmit.verifyUIElements(copy)
        crossDeviceSubmit.clickOnSubmitVerificationButton()
        verificationComplete.verifyUIElements(copy)
      })

      it('should check Submit Verification button can only be clicked once when there is no Complete step', async () => {
        driver.get(`${baseUrl}&noCompleteStep=true`)
        welcome.continueToNextStep()
        documentSelector.clickOnPassportIcon()
        runThroughCrossDeviceFlow()
        documentUpload.clickUploadButton()
        uploadFileAndClickConfirmButton(
          passportUploadImageGuide,
          confirm,
          'passport.jpg'
        )
        selfieIntro.clickOnContinueButton()
        camera.enableCameraAccessIfNecessary()
        camera.takeSelfie()
        confirm.clickConfirmButton()
        crossDeviceClientSuccess.verifyUIElements(copy)
        switchBrowserTab(0, driver)
        crossDeviceSubmit.documentUploadedMessage().isDisplayed()
        crossDeviceSubmit.clickOnSubmitVerificationButton()
        assert.isFalse(
          crossDeviceSubmit.submitVerificationButton().isEnabled(),
          'Test Failed: Submit Verification button should be disabled'
        )
      })

      it('should complete cross device e2e flow with a US JWT', async () => {
        driver.get(`${baseUrl}&region=US`)
        welcome.continueToNextStep()
        documentSelector.clickOnPassportIcon()
        runThroughCrossDeviceFlow()
        documentUpload.clickUploadButton()
        uploadFileAndClickConfirmButton(
          passportUploadImageGuide,
          confirm,
          'passport.jpg'
        )
        selfieIntro.clickOnContinueButton()
        camera.enableCameraAccessIfNecessary()
        camera.takeSelfie()
        confirm.clickConfirmButton()
        crossDeviceClientSuccess.verifyUIElements(copy)
        switchBrowserTab(0, driver)
        crossDeviceSubmit.documentUploadedMessage().isDisplayed()
        crossDeviceSubmit.clickOnSubmitVerificationButton()
        verificationComplete.verifyUIElements(copy)
      })

      it('should hide logo on all screens when hideOnfidoLogo is enabled and given token has feature enabled', async () => {
        driver.get(`${baseUrl}&hideOnfidoLogo=true`)
        welcome.checkLogoIsHidden()
        welcome.continueToNextStep()
        documentSelector.checkLogoIsHidden()
        documentSelector.clickOnPassportIcon()
        runThroughCrossDeviceFlow()
        documentUpload.checkLogoIsHidden()
        documentUpload.clickUploadButton()
        uploadFileAndClickConfirmButton(
          passportUploadImageGuide,
          confirm,
          'passport.jpg'
        )
        selfieIntro.checkLogoIsHidden()
        selfieIntro.clickOnContinueButton()
        camera.checkLogoIsHidden()
        camera.enableCameraAccessIfNecessary()
        camera.takeSelfie()
        confirm.checkLogoIsHidden()
        confirm.clickConfirmButton()
        crossDeviceClientSuccess.checkLogoIsHidden()
        switchBrowserTab(0, driver)
        crossDeviceSubmit.checkLogoIsHidden()
        crossDeviceSubmit.clickOnSubmitVerificationButton()
        verificationComplete.checkLogoIsHidden()
      })

      it('should show the cobrand text and logo on all screens when showCobrand is enabled and token has feature enabled', async () => {
        driver.get(`${baseUrl}&showCobrand=true`)
        welcome.checkCobrandIsVisible()
        welcome.continueToNextStep()
        documentSelector.checkCobrandIsVisible()
        documentSelector.clickOnPassportIcon()
        runThroughCrossDeviceFlow()
        documentUpload.checkCobrandIsVisible()
        documentUpload.clickUploadButton()
        uploadFileAndClickConfirmButton(
          passportUploadImageGuide,
          confirm,
          'passport.jpg'
        )
        selfieIntro.checkCobrandIsVisible()
        selfieIntro.clickOnContinueButton()
        camera.checkCobrandIsVisible()
        camera.enableCameraAccessIfNecessary()
        camera.takeSelfie()
        confirm.checkCobrandIsVisible()
        confirm.clickConfirmButton()
        crossDeviceClientSuccess.checkCobrandIsVisible()
        switchBrowserTab(0, driver)
        crossDeviceSubmit.checkCobrandIsVisible()
        crossDeviceSubmit.clickOnSubmitVerificationButton()
        verificationComplete.checkCobrandIsVisible()
      })

      it('should not show any logo, including cobrand text and logo on all screens when showCobrand is enabled but hideOnfidoLogo is also enabled', async () => {
        driver.get(`${baseUrl}&showCobrand=true&hideOnfidoLogo=true`)
        welcome.checkLogoIsHidden()
        welcome.continueToNextStep()
        documentSelector.checkLogoIsHidden()
        documentSelector.clickOnPassportIcon()
        runThroughCrossDeviceFlow()
        documentUpload.checkLogoIsHidden()
        documentUpload.clickUploadButton()
        uploadFileAndClickConfirmButton(
          passportUploadImageGuide,
          confirm,
          'passport.jpg'
        )
        selfieIntro.checkLogoIsHidden()
        selfieIntro.clickOnContinueButton()
        camera.checkLogoIsHidden()
        camera.enableCameraAccessIfNecessary()
        camera.takeSelfie()
        confirm.checkLogoIsHidden()
        confirm.clickConfirmButton()
        crossDeviceClientSuccess.checkLogoIsHidden()
        switchBrowserTab(0, driver)
        crossDeviceSubmit.checkLogoIsHidden()
        crossDeviceSubmit.clickOnSubmitVerificationButton()
        verificationComplete.checkLogoIsHidden()
      })
      it('should show the cobrand logo and onfido logo on all screens when showLogoCobrand is enabled and token has feature enabled', async () => {
        driver.get(`${baseUrl}&showLogoCobrand=true`)
        welcome.checkLogoCobrandIsVisible()
        welcome.continueToNextStep()
        documentSelector.checkLogoCobrandIsVisible()
        documentSelector.clickOnPassportIcon()
        runThroughCrossDeviceFlow()
        documentUpload.checkLogoCobrandIsVisible()
        documentUpload.clickUploadButton()
        uploadFileAndClickConfirmButton(
          passportUploadImageGuide,
          confirm,
          'passport.jpg'
        )
        selfieIntro.checkLogoCobrandIsVisible()
        selfieIntro.clickOnContinueButton()
        camera.checkLogoCobrandIsVisible()
        camera.enableCameraAccessIfNecessary()
        camera.takeSelfie()
        confirm.checkLogoCobrandIsVisible()
        confirm.clickConfirmButton()
        crossDeviceClientSuccess.checkLogoCobrandIsVisible()
        switchBrowserTab(0, driver)
        crossDeviceSubmit.checkLogoCobrandIsVisible()
        crossDeviceSubmit.clickOnSubmitVerificationButton()
        verificationComplete.checkLogoCobrandIsVisible()
      })
    }
  )
}
