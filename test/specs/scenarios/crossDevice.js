import { describe, it } from '../../utils/mochaw'
import { localhostUrl, testDeviceMobileNumber } from '../../config.json'
import { goToPassportUploadScreen, uploadFileAndClickConfirmButton } from './sharedFlows.js'
import { until } from 'selenium-webdriver'
const assert = require('chai').assert

const options = {
  pageObjects: [
    'Welcome',
    'Confirm',
    'Camera',
    'DocumentSelector',
    'DocumentUpload',
    'CrossDeviceClientSuccess',
    'CrossDeviceIntro',
    'CrossDeviceLink',
    'CrossDeviceMobileNotificationSent',
    'CrossDeviceMobileConnected',
    'CrossDeviceSubmit',
    'VerificationComplete',
    'BasePage'
  ]
}

export const crossDeviceScenarios = async (lang) => {

  describe(`CROSS DEVICE scenarios in ${lang}`, options, ({driver, pageObjects}) => {
    const {
      welcome,
      confirm,
      camera,
      documentSelector,
      documentUpload,
      crossDeviceClientSuccess,
      crossDeviceIntro,
      crossDeviceLink,
      crossDeviceMobileNotificationSent,
      crossDeviceMobileConnected,
      crossDeviceSubmit,
      verificationComplete,
      basePage
    } = pageObjects

    const baseUrl = `${localhostUrl}?language=${lang}`

    const copy = basePage.copy(lang)

    const goToCrossDeviceScreen = async () => {
      welcome.primaryBtn().click()
      documentSelector.passportIcon.click()
      documentUpload.switchToCrossDeviceButton.click()
      crossDeviceIntro.continueButton.click()
    }

    const waitForAlertToAppearAndSendSms = async () => {
      driver.wait(until.alertIsPresent())
      driver.switchTo().alert().accept()
      crossDeviceLink.clickOnSendLinkButton()
    }

    const copyCrossDeviceLinkAndOpenInNewTab = async () => {
      const crossDeviceLinkText = crossDeviceLink.copyLinkTextContainer.getText()
      driver.executeScript("window.open('your url','_blank');")
      switchBrowserTab(1)
      driver.get(crossDeviceLinkText)
    }

    const switchBrowserTab = async (tab) => {
      const browserWindows = driver.getAllWindowHandles()
      driver.switchTo().window(browserWindows[tab])
    }

    const runThroughCrossDeviceFlow = async () => {
      documentUpload.switchToCrossDeviceButton.click()
      crossDeviceIntro.continueButton.click()
      crossDeviceLink.switchToCopyLinkOptionBtn.click()
      copyCrossDeviceLinkAndOpenInNewTab()
      switchBrowserTab(0)
      crossDeviceMobileConnected.tipsHeader().isDisplayed()
      crossDeviceMobileConnected.verifyUIElements(copy)
      switchBrowserTab(1)
      driver.sleep(1000)
    }

    it('should verify UI elements on the cross device intro screen', async () => {
      driver.get(baseUrl)
      welcome.primaryBtn().click()
      documentSelector.passportIcon.click()
      documentUpload.switchToCrossDeviceButton.click()
      crossDeviceIntro.verifyTitle(copy)
      crossDeviceIntro.verifySubTitle(copy)
      crossDeviceIntro.verifyIcons(copy)
      crossDeviceIntro.verifyMessages(copy)
    })

    it('should display cross device intro screen if forceCrossDevice is enabled', async () => {
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
      const crossDeviceLinkStrings = copy.cross_device.link
      crossDeviceLink.verifyTitle(copy)
      crossDeviceLink.verifySubtitle(crossDeviceLinkStrings.qr_code_sub_title)
      assert.isTrue(crossDeviceLink.qrCode.isDisplayed(), 'Test Failed: QR Code should be visible')
      crossDeviceLink.verifyQRCodeHelpToggleBtn(crossDeviceLinkStrings.qr_code.help_label)
      crossDeviceLink.qrCodeHelpToggleBtn.click()
      assert.isTrue(crossDeviceLink.qrCodeHelpList.isDisplayed(), 'Test Failed: QR Code help instructions should be visible')
      crossDeviceLink.verifyQRCodeHelpInstructions(crossDeviceLinkStrings.qr_code)
      crossDeviceLink.qrCodeHelpToggleBtn.click()
      assert.isFalse(crossDeviceLink.qrCodeHelpList.isDisplayed(), 'Test Failed: QR Code help instructions should be hidden')
      crossDeviceLink.verifySwitchToSmsOptionBtn(crossDeviceLinkStrings.sms_option)
      crossDeviceLink.verifySwitchToCopyLinkOptionBtn(crossDeviceLinkStrings.copy_link_option)
    })

    it('should verify UI elements on the cross device link screen SMS view', async () => {
      driver.get(baseUrl)
      goToCrossDeviceScreen()
      const crossDeviceLinkStrings = copy.cross_device.link
      crossDeviceLink.verifyTitle(copy)
      crossDeviceLink.switchToSmsOptionBtn.click()
      crossDeviceLink.verifySubtitle(crossDeviceLinkStrings.sms_sub_title)
      crossDeviceLink.verifyNumberInputLabel(copy)
      crossDeviceLink.verifyNumberInput()
      crossDeviceLink.verifySendLinkBtn(copy)
      crossDeviceLink.verifySwitchToQrCodeOptionBtn(copy.cross_device.link.qr_code_option)
      crossDeviceLink.verifySwitchToCopyLinkOptionBtn(copy.cross_device.link.copy_link_option)
    })

    it('should verify UI elements on the cross device link screen copy link view', async () => {
      driver.get(baseUrl)
      goToCrossDeviceScreen()
      const crossDeviceLinkStrings = copy.cross_device.link
      crossDeviceLink.verifyTitle(copy)
      crossDeviceLink.switchToCopyLinkOptionBtn.click()
      crossDeviceLink.verifySubtitle(crossDeviceLinkStrings.copy_link_sub_title)
      crossDeviceLink.verifyCopyLinkInsteadLabel(copy)
      crossDeviceLink.verifyCopyToClipboardBtn(copy)
      crossDeviceLink.verifyCopyLinkTextContainer()
      crossDeviceLink.verifyDivider()
      crossDeviceLink.verifySwitchToQrCodeOptionBtn(copy.cross_device.link.qr_code_option)
      crossDeviceLink.verifySwitchToSmsOptionBtn(copy.cross_device.link.sms_option)
    })

    it('should change the state of the copy to clipboard button after clicking', async () => {
      driver.get(baseUrl)
      goToCrossDeviceScreen()
      crossDeviceLink.switchToCopyLinkOptionBtn.click()
      crossDeviceLink.copyToClipboardBtn.click()
      crossDeviceLink.verifyCopyToClipboardBtnChangedState(copy)
    })

    it('should display error when mobile number is not provided', async () => {
      driver.get(baseUrl)
      goToCrossDeviceScreen()
      crossDeviceLink.switchToSmsOptionBtn.click()
      crossDeviceLink.typeMobileNumber('')
      crossDeviceLink.clickOnSendLinkButton()
      crossDeviceLink.verifyCheckNumberCorrectError(copy)
    })

    it('should display error when mobile number is wrong', async () => {
      driver.get(baseUrl)
      goToCrossDeviceScreen()
      crossDeviceLink.switchToSmsOptionBtn.click()
      crossDeviceLink.typeMobileNumber('123456789')
      crossDeviceLink.clickOnSendLinkButton()
      driver.sleep(500)
      crossDeviceLink.verifyCheckNumberCorrectError(copy)
    })

    it('should display error when mobile number is possible but not a valid mobile number', async () => {
      driver.get(baseUrl)
      goToCrossDeviceScreen()
      crossDeviceLink.switchToSmsOptionBtn.click()
      crossDeviceLink.selectCountryOption('HK')
      crossDeviceLink.typeMobileNumber('99999999')
      crossDeviceLink.clickOnSendLinkButton()
      driver.sleep(500)
      crossDeviceLink.verifyCheckNumberCorrectError(copy)
    })

    it('should send sms and navigate to "Check your mobile" screen ', async () => {
      driver.get(baseUrl)
      goToCrossDeviceScreen()
      crossDeviceLink.switchToSmsOptionBtn.click()
      crossDeviceLink.typeMobileNumber(testDeviceMobileNumber)
      crossDeviceLink.clickOnSendLinkButton()
      waitForAlertToAppearAndSendSms()
      crossDeviceMobileNotificationSent.verifyCheckYourMobilePhoneIcon()
      crossDeviceMobileNotificationSent.verifyTitle(copy)
      if (lang === 'en') {
        crossDeviceMobileNotificationSent.verifySubmessage('We\'ve sent a secure link to +447495023357')
      } else {
        crossDeviceMobileNotificationSent.verifySubmessage('Hemos enviado un enlace seguro a +447495023357')
      }
      crossDeviceMobileNotificationSent.verifyItMayTakeFewMinutesMessage(copy)
      crossDeviceMobileNotificationSent.verifyTipsHeader(copy)
      crossDeviceMobileNotificationSent.verifyTips(copy)
      crossDeviceMobileNotificationSent.verifyResendLink(copy)
    })

    it('should be able to resend sms', async () => {
      driver.get(baseUrl)
      goToCrossDeviceScreen()
      crossDeviceLink.switchToSmsOptionBtn.click()
      crossDeviceLink.typeMobileNumber(testDeviceMobileNumber)
      crossDeviceLink.clickOnSendLinkButton()
      waitForAlertToAppearAndSendSms()
      crossDeviceMobileNotificationSent.verifyCheckYourMobilePhoneIcon()
      crossDeviceMobileNotificationSent.clickResendLink()
      crossDeviceLink.switchToSmsOptionBtn.click()
      crossDeviceLink.clickOnSendLinkButton()
      waitForAlertToAppearAndSendSms()
      crossDeviceMobileNotificationSent.verifyCheckYourMobilePhoneIcon()
      crossDeviceMobileNotificationSent.verifyTitle(copy)
    })

    it('should succesfully complete cross device e2e flow with selfie upload', async () => {
      goToPassportUploadScreen(driver, welcome, documentSelector, `?language=${lang}&async=false&useWebcam=false`)
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'passport.jpg')
      runThroughCrossDeviceFlow()
      documentUpload.verifySelfieUploadTitle(copy)
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'face.jpeg')
      crossDeviceClientSuccess.verifyUIElements(copy)
      switchBrowserTab(0)
      crossDeviceSubmit.documentUploadedMessage().isDisplayed()
      crossDeviceSubmit.verifyUIElements(copy)
      crossDeviceSubmit.clickOnSubmitVerificationButton()
      verificationComplete.verifyUIElements(copy)
    })

    it('should succesfully complete cross device e2e flow with document and selfie upload', async () => {
      goToPassportUploadScreen(driver, welcome, documentSelector,`?language=${lang}&async=false&useWebcam=false`)
      runThroughCrossDeviceFlow()
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'passport.jpg')
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'face.jpeg')
      crossDeviceClientSuccess.verifyUIElements(copy)
      switchBrowserTab(0)
      driver.sleep(1000)
      crossDeviceSubmit.documentUploadedMessage().isDisplayed()
      crossDeviceSubmit.verifyUIElements(copy)
      crossDeviceSubmit.clickOnSubmitVerificationButton()
      verificationComplete.verifyUIElements(copy)
    })

    it('should check Submit Verification button can only be clicked once when there is no Complete step', async () => {
      driver.get(`${baseUrl}&noCompleteStep=true`)
      welcome.primaryBtn().click()
      documentSelector.passportIcon.click()
      runThroughCrossDeviceFlow()
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'passport.jpg')
      camera.takeSelfie()
      confirm.confirmBtn().click()
      crossDeviceClientSuccess.verifyUIElements(copy)
      switchBrowserTab(0)
      crossDeviceSubmit.documentUploadedMessage().isDisplayed()
      crossDeviceSubmit.clickOnSubmitVerificationButton()
      assert.isFalse(crossDeviceSubmit.submitVerificationButton.isEnabled(), 'Test Failed: Submit Verification button should be disabled')
    })
  })
}
