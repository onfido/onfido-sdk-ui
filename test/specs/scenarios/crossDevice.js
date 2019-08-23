import { describe, it } from '../../utils/mochaw'
import { localhostUrl, testDeviceMobileNumber } from '../../config.json'
import { goToPassportUploadScreen, uploadFileAndClickConfirmButton } from './sharedFlows.js'
import { until } from 'selenium-webdriver'

const options = {
  pageObjects: [
    'Welcome',
    'Confirm',
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

    const copy = basePage.copy(lang)


    const goToCrossDeviceScreen = async () => {
      welcome.primaryBtn.click()
      documentSelector.passportIcon.click()
      documentUpload.crossDeviceIcon.click()
      crossDeviceIntro.continueButton.click()
    }

    const waitForAlertToAppearAndSendSms = async () => {
      driver.wait(until.alertIsPresent())
      driver.switchTo().alert().accept()
      crossDeviceLink.clickOnSendLinkButton()
    }

    describe('cross device sync intro screen', async () =>  {
      it('should verify UI elements on the cross device intro screen', async () => {
        driver.get(localhostUrl + `?language=${lang}`)
        welcome.primaryBtn.click()
        documentSelector.passportIcon.click()
        documentUpload.crossDeviceIcon.click()
        crossDeviceIntro.verifyTitle(copy)
        crossDeviceIntro.verifyIcons(copy)
        crossDeviceIntro.verifyMessages(copy)
      })
    })

    describe('cross device sync screen', async () => {
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
        const yourMobilePhoneIconSelector = crossDeviceMobileNotificationSent.yourMobilePhoneIconSelector
        crossDeviceMobileNotificationSent.waitForElementToBeLocated(yourMobilePhoneIconSelector)
        crossDeviceMobileNotificationSent.verifyTitle(copy)
      })
    })

    describe('cross device check your mobile screen', async () => {
      const yourMobilePhoneIconSelector = crossDeviceMobileNotificationSent.yourMobilePhoneIconSelector


      it('should verify UI elements of the cross device check your mobile screen', async () => {
        driver.get(localhostUrl + `?language=${lang}`)
        goToCrossDeviceScreen()
        crossDeviceLink.typeMobileNumber(testDeviceMobileNumber)
        crossDeviceLink.clickOnSendLinkButton()
        waitForAlertToAppearAndSendSms()
        crossDeviceMobileNotificationSent.waitForElementToBeLocated(yourMobilePhoneIconSelector)
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
        driver.get(localhostUrl + `?language=${lang}`)
        goToCrossDeviceScreen()
        crossDeviceLink.typeMobileNumber(testDeviceMobileNumber)
        crossDeviceLink.clickOnSendLinkButton()
        waitForAlertToAppearAndSendSms()
        crossDeviceMobileNotificationSent.waitForElementToBeLocated(yourMobilePhoneIconSelector)
        crossDeviceMobileNotificationSent.clickResendLink()
        crossDeviceLink.clickOnSendLinkButton()
        waitForAlertToAppearAndSendSms()
        crossDeviceMobileNotificationSent.waitForElementToBeLocated(yourMobilePhoneIconSelector)
        crossDeviceMobileNotificationSent.verifyTitle(copy)
      })
    })

    describe('cross device e2e flow', async () => {
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
        documentUpload.crossDeviceIcon.click()
        crossDeviceIntro.continueButton.click()
        copyCrossDeviceLinkAndOpenInNewTab()
        switchBrowserTab(0)
        const tipsHeaderSelector = crossDeviceMobileConnected.tipsHeaderSelector
        crossDeviceMobileConnected.waitForElementToBeLocated(tipsHeaderSelector)
        crossDeviceMobileConnected.verifyUIElements(copy)
        switchBrowserTab(1)
        driver.sleep(1000)
      }

      const documentUploadedMessageSelector = crossDeviceSubmit.documentUploadedMessageSelector

      it('should succesfully complete cross device e2e flow with selfie upload', async () => {
        goToPassportUploadScreen(driver, welcome, documentSelector, `?language=${lang}&async=false&useWebcam=false`)
        uploadFileAndClickConfirmButton(documentUpload, confirm, 'passport.jpg')
        runThroughCrossDeviceFlow()
        documentUpload.verifySelfieUploadTitle(copy)
        uploadFileAndClickConfirmButton(documentUpload, confirm, 'face.jpeg')
        crossDeviceClientSuccess.verifyUIElements(copy)
        switchBrowserTab(0)
        crossDeviceSubmit.waitForElementToBeLocated(documentUploadedMessageSelector)
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
        crossDeviceSubmit.waitForElementToBeLocated(documentUploadedMessageSelector)
        crossDeviceSubmit.verifyUIElements(copy)
        crossDeviceSubmit.clickOnSubmitVerificationButton()
        verificationComplete.verifyUIElements(copy)
      })
    })
  })
}
