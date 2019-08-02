import { it } from '../../utils/mochaw'
import { localhostUrl } from '../../utils/config'

export const crossDeviceScenarios = (driver, screens, lang) => {
  const {
    welcome,
    documentSelector,
    documentUpload,
    crossDeviceClientSuccess,
    crossDeviceIntro,
    crossDeviceLink,
    crossDeviceMobileNotificationSent,
    crossDeviceMobileConnected,
    crossDeviceSubmit,
    documentUploadConfirmation,
    verificationComplete,
    common
  } = screens

  const copy = common.copy(lang)
  describe(`CROSS DEVICE scenarios in ${lang}`, () => {

    const goToCrossDeviceScreen = async () => {
      welcome.primaryBtn.click()
      documentSelector.passportIcon.click()
      documentUpload.crossDeviceIcon.click()
      crossDeviceIntro.continueButton.click()
    }

    const waitForAlertToAppearAndSendSms = async () => {
      driver.sleep(1000)
      driver.switchTo().alert().accept()
      crossDeviceLink.clickOnSendLinkButton()
      driver.sleep(2000)
    }

    describe('cross device sync intro screen', async () =>  {
      it('should verify UI elements on the cross device intro screen', async () => {
        driver.get(localhostUrl + `?language=${lang}`)
        const crossDeviceIntroCopy = documentSelector.copy(lang)
        welcome.primaryBtn.click()
        documentSelector.passportIcon.click()
        documentUpload.crossDeviceIcon.click()
        crossDeviceIntro.verifyTitle(crossDeviceIntroCopy)
        crossDeviceIntro.verifyIcons(crossDeviceIntroCopy)
        crossDeviceIntro.verifyMessages(crossDeviceIntroCopy)
      })
    })

    describe('cross device sync screen', async () => {
      const testDeviceMobileNumber = '07495 023357'

      it('should verify UI elements on the cross device sync screen', async () => {
        driver.get(localhostUrl + `?language=${lang}`)
        goToCrossDeviceScreen()
        crossDeviceLink.verifyTitle(copy)
        crossDeviceLink.verifySubtitle(copy)
        crossDeviceLink.verifyNumberInputLabel(copy)
        crossDeviceLink.verifyNumberInput()
        crossDeviceLink.verifySendLinkBtn(copy)
        crossDeviceLink.verifyCopyLinkInsteadLabel(copy)
        crossDeviceLink.verifyCopyToClipboardBtn(copy)
        crossDeviceLink.verifyCopyLinkTextContainer()
        crossDeviceLink.verifyDivider()
      })

      it('should change the state of the copy to clipboard button after clicking', async () => {
        driver.get(localhostUrl + `?language=${lang}`)
        goToCrossDeviceScreen()
        crossDeviceLink.copyToClipboardBtn.click()
        crossDeviceLink.verifyCopyToClipboardBtnChangedState(copy)
      })

      it('should display error when number is not provided', async () => {
        driver.get(localhostUrl + `?language=${lang}`)
        goToCrossDeviceScreen()
        crossDeviceLink.typeMobileNumber('123456789')
        crossDeviceLink.clickOnSendLinkButton()
        crossDeviceLink.verifyCheckNumberCorrectError(copy)
      })

      it('should display error when number is wrong', async () => {
        driver.get(localhostUrl + `?language=${lang}`)
        goToCrossDeviceScreen()
        crossDeviceLink.typeMobileNumber('123456789')
        crossDeviceLink.clickOnSendLinkButton()
        driver.sleep(500)
        crossDeviceLink.verifyCheckNumberCorrectError(copy)
      })

      it('should send sms and navigate to check your mobile screen ', async () => {
        driver.get(localhostUrl + `?language=${lang}`)
        goToCrossDeviceScreen()
        crossDeviceLink.typeMobileNumber(testDeviceMobileNumber)
        crossDeviceLink.clickOnSendLinkButton()
        waitForAlertToAppearAndSendSms()
        crossDeviceMobileNotificationSent.verifyTitle(copy)
      })
    })

    describe('cross device check your mobile screen', async () => {
      it('should verify UI elements of the cross device check your mobile screen', async () => {
        driver.get(localhostUrl + `?language=${lang}`)
        goToCrossDeviceScreen()
        crossDeviceLink.typeMobileNumber('07495 023357')
        crossDeviceLink.clickOnSendLinkButton()
        waitForAlertToAppearAndSendSms()
        crossDeviceMobileNotificationSent.verifyTitle(copy)
        if (lang === 'en') {
          crossDeviceMobileNotificationSent.verifySubmessage('We’ve sent a secure link to +447495023357')
        } else {
          crossDeviceMobileNotificationSent.verifySubmessage('Hemos enviado un enlace seguro a +447495023357')
        }
        crossDeviceMobileNotificationSent.verifyMayTakeFewMinutesMessage(copy)
        crossDeviceMobileNotificationSent.verifyTipsHeader(copy)
        crossDeviceMobileNotificationSent.verifyTips(copy)
        crossDeviceMobileNotificationSent.verifyResendLink(copy)
      })

      it('should be able to resend sms', async () => {
        driver.get(localhostUrl)
        goToCrossDeviceScreen()
        crossDeviceLink.typeMobileNumber('07495 023357')
        crossDeviceLink.clickOnSendLinkButton()
        waitForAlertToAppearAndSendSms()
        crossDeviceMobileNotificationSent.clickResendLink()
        crossDeviceLink.clickOnSendLinkButton()
        waitForAlertToAppearAndSendSms()
        crossDeviceMobileNotificationSent.verifyTitle(copy)
      })
    })

    describe('cross device e2e flow', async () => {
      const goToPassportUploadScreen = async (parameter='') => {
        driver.get(localhostUrl + parameter)
        welcome.primaryBtn.click()
        documentSelector.passportIcon.click()
      }

      const uploadFileAndClickConfirmButton = async (fileName) => {
        documentUpload.getUploadInput()
        documentUpload.upload(fileName)
        documentUploadConfirmation.confirmBtn.click()
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

      it('should succesfully complete cross device e2e flow with selfie upload', async () => {
        goToPassportUploadScreen(`?language=${lang}&?async=false&useWebcam=false`)
        uploadFileAndClickConfirmButton('passport.jpg')
        documentUpload.crossDeviceIcon.click()
        crossDeviceIntro.continueButton.click()
        copyCrossDeviceLinkAndOpenInNewTab()
        switchBrowserTab(0)
        driver.sleep(2000)
        crossDeviceMobileConnected.verifyUIElements(copy)
        switchBrowserTab(1)
        driver.sleep(1000)
        documentUpload.verifySelfieUploadTitle(copy)
        uploadFileAndClickConfirmButton('face.jpeg')
        crossDeviceClientSuccess.verifyUIElements(copy)
        switchBrowserTab(0)
        driver.sleep(1000)
        crossDeviceSubmit.verifyUIElements(copy)
        crossDeviceSubmit.clickOnSubmitVerificationButton()
        verificationComplete.verifyUIElements(copy)
      })

      it('should succesfully complete cross device e2e flow with document and selfie upload', async () => {
        goToPassportUploadScreen(`?language=${lang}&?async=false&useWebcam=false`)
        documentUpload.crossDeviceIcon.click()
        crossDeviceIntro.continueButton.click()
        copyCrossDeviceLinkAndOpenInNewTab()
        switchBrowserTab(0)
        driver.sleep(2000)
        crossDeviceMobileConnected.verifyUIElements(copy)
        switchBrowserTab(1)
        driver.sleep(1000)
        uploadFileAndClickConfirmButton('passport.jpg')
        uploadFileAndClickConfirmButton('face.jpeg')
        crossDeviceClientSuccess.verifyUIElements(copy)
        switchBrowserTab(0)
        driver.sleep(1000)
        crossDeviceSubmit.verifyUIElements(copy)
        crossDeviceSubmit.clickOnSubmitVerificationButton()
        verificationComplete.verifyUIElements(copy)
      })
    })
  })
}
