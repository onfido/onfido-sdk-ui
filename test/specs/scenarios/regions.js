import { describe, it } from '../../utils/mochaw'
import { goToPassportUploadScreen, uploadFileAndClickConfirmButton } from './sharedFlows.js'
import { localhostUrl, testDeviceMobileNumber } from '../../config.json'
import { until } from 'selenium-webdriver'
const assert = require('chai').assert


const options = {
  pageObjects: [
    'Welcome',
    'CrossDeviceIntro',
    'CrossDeviceLink',
    'CrossDeviceMobileNotificationSent',
    'DocumentSelector',
    'DocumentUpload',
    'Confirm',
    'VerificationComplete',
    'Camera',
    'CameraPermissions',
    'LivenessIntro',
    'SelfieIntro'
  ]
}

export const regionsScenarios = async(region) => {
  
  describe(`Regions Testing`, options, ({driver, pageObjects}) => {
    const {
      welcome,
      crossDeviceIntro,
      crossDeviceLink,
      crossDeviceMobileNotificationSent,
      documentSelector,
      documentUpload,
      confirm,
      verificationComplete,
      camera,
      livenessIntro,
      selfieIntro,
    } = pageObjects

    const copy = welcome.copy()
    const baseUrl = `${localhostUrl}`

    const goToCrossDeviceScreen = async () => {
      welcome.continueToNextStep()
      documentSelector.clickOnPassportIcon()
      documentUpload.switchToCrossDevice()
      crossDeviceIntro.continueToNextStep()
    }

    const waitForAlertToAppearAndSendSms = async () => {
      driver.wait(until.alertIsPresent())
      driver.switchTo().alert().accept()
      crossDeviceLink.clickOnSendLinkButton()
    }

    //cross device
    it(`should send sms and navigate to "Check your mobile" screen for ${region}`, async () => {
      driver.get(baseUrl + `?region=${region}`)
      goToCrossDeviceScreen()
      crossDeviceLink.switchToSendSmsOption()
      crossDeviceLink.typeMobileNumber(testDeviceMobileNumber)
      crossDeviceLink.clickOnSendLinkButton()
      waitForAlertToAppearAndSendSms()
      // crossDeviceMobileNotificationSent.verifyCheckYourMobilePhoneIcon()
      crossDeviceMobileNotificationSent.verifyTitle(copy)
      // crossDeviceMobileNotificationSent.verifySubmessage('We\'ve sent a secure link to +447495023357')
      // crossDeviceMobileNotificationSent.verifyItMayTakeFewMinutesMessage(copy)
      // crossDeviceMobileNotificationSent.verifyTipsHeader(copy)
      // crossDeviceMobileNotificationSent.verifyTips(copy)
      // crossDeviceMobileNotificationSent.verifyResendLink(copy)
    })

    // live-videos endpoint
    it(`should record a video with live challenge, play it and submit it for ${region}`, async () => {
      goToPassportUploadScreen(driver, welcome, documentSelector,`?liveness=true&region=${region}`)
      driver.executeScript('window.navigator.mediaDevices.enumerateDevices = () => Promise.resolve([{ kind: "video" }])')
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'passport.jpg')
      livenessIntro.verifyUIElementsOnTheLivenessIntroScreen(copy)
      livenessIntro.clickOnContinueButton()
      camera.recordVideo()
      assert.isTrue(camera.isOverlayPresent(), 'Test Failed: Face overlay should be displayed')
      camera.completeChallenges()
      confirm.playVideoBeforeConfirm()
      confirm.clickConfirmButton()
      verificationComplete.verifyUIElements(copy)
    })

    //live-photos
    it(`should take one selfie using the camera stream for ${region}`, async () => {
      goToPassportUploadScreen(driver, welcome, documentSelector,`?async=false&region=${region}`)
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'passport.jpg')
      selfieIntro.verifyUIElementsOnTheSelfieIntroScreen(copy)
      selfieIntro.clickOnContinueButton()
      camera.takeSelfie()
      confirm.clickConfirmButton()
      verificationComplete.verifyUIElements(copy)
    })

    //useMultipleSelfieCapture
    it(`should complete the flow when snapshot is enabled for ${region}`, async () => {
      goToPassportUploadScreen(driver, welcome, documentSelector,`?async=false&useMultipleSelfieCapture=true&region=${region}`)
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'passport.jpg')
      selfieIntro.verifyUIElementsOnTheSelfieIntroScreen(copy)
      selfieIntro.clickOnContinueButton()
      camera.takeSelfie()
      confirm.clickConfirmButton()
      verificationComplete.verifyUIElements(copy)
    })
  })
}