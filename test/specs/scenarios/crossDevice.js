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

      const switchToCrossDeviceFlow = async () => {
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

      it('should succesfully complete cross device e2e flow with document and selfie upload', async () => {
        // FIXME: This & test above for E2E cross device flow with uploads excluded from automated E2E Prod tests
        //        as they consistently cause build to fail after 10ish minutes, but no issues running through manually.
        goToPassportUploadScreen(
          driver,
          welcome,
          documentSelector,
          `?language=${lang}&useUploader=true`
        )
        switchToCrossDeviceFlow()
        crossDeviceClientIntro.continueToNextStep()
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

      it.skip('should complete cross device e2e flow with a US JWT', async () => {
        driver.get(`${baseUrl}&region=US`)
        welcome.continueToNextStep()
        documentSelector.clickOnPassportIcon()
        switchToCrossDeviceFlow()
        crossDeviceClientIntro.continueToNextStep()
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

      it.skip('should hide logo on all screens when hideOnfidoLogo is enabled and given token has feature enabled', async () => {
        driver.get(`${baseUrl}&hideOnfidoLogo=true`)
        welcome.checkLogoIsHidden()
        welcome.continueToNextStep()
        documentSelector.checkLogoIsHidden()
        documentSelector.clickOnPassportIcon()
        switchToCrossDeviceFlow()
        crossDeviceClientIntro.checkLogoIsHidden()
        crossDeviceClientIntro.continueToNextStep()
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

      it.skip('should show the cobrand text and logo on all screens when showCobrand is enabled and token has feature enabled', async () => {
        driver.get(`${baseUrl}&showCobrand=true`)
        welcome.checkCobrandIsVisible()
        welcome.continueToNextStep()
        documentSelector.checkCobrandIsVisible()
        documentSelector.clickOnPassportIcon()
        switchToCrossDeviceFlow()
        crossDeviceClientIntro.checkCobrandIsVisible()
        crossDeviceClientIntro.continueToNextStep()
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

      it.skip('should not show any logo, including cobrand text and logo on all screens when showCobrand is enabled but hideOnfidoLogo is also enabled', async () => {
        driver.get(`${baseUrl}&showCobrand=true&hideOnfidoLogo=true`)
        welcome.checkLogoIsHidden()
        welcome.continueToNextStep()
        documentSelector.checkLogoIsHidden()
        documentSelector.clickOnPassportIcon()
        switchToCrossDeviceFlow()
        crossDeviceClientIntro.checkLogoIsHidden()
        crossDeviceClientIntro.continueToNextStep()
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

      it.skip('should show the cobrand logo and Onfido logo on all screens when showLogoCobrand is enabled and token has feature enabled', async () => {
        driver.get(`${baseUrl}&showLogoCobrand=true`)
        welcome.checkLogoCobrandIsVisible()
        welcome.continueToNextStep()
        documentSelector.checkLogoCobrandIsVisible()
        documentSelector.clickOnPassportIcon()
        switchToCrossDeviceFlow()
        crossDeviceClientIntro.checkLogoCobrandIsVisible()
        crossDeviceClientIntro.continueToNextStep()
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
