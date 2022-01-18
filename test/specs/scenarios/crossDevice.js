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
