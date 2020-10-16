import { describe, it } from '../../utils/mochaw'
import {
  goToPassportUploadScreen,
  uploadFileAndClickConfirmButton,
} from './sharedFlows.js'
import { until } from 'selenium-webdriver'
const assert = require('chai').assert

const options = {
  pageObjects: [
    'Welcome',
    'Camera',
    'CrossDeviceIntro',
    'CameraPermissions',
    'Confirm',
    'DocumentSelector',
    'PassportUploadImageGuide',
    'DocumentUpload',
    'LivenessIntro',
    'SelfieIntro',
    'VerificationComplete',
    'BasePage',
  ],
}

export const faceScenarios = (lang) => {
  describe(`FACE scenarios in ${lang}`, options, ({ driver, pageObjects }) => {
    const {
      welcome,
      camera,
      crossDeviceIntro,
      cameraPermissions,
      confirm,
      documentSelector,
      passportUploadImageGuide,
      documentUpload,
      livenessIntro,
      selfieIntro,
      verificationComplete,
      basePage,
    } = pageObjects

    const copy = basePage.copy(lang)

    it('should return unsupported file type error for selfie', async () => {
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
      uploadFileAndClickConfirmButton(
        documentUpload,
        confirm,
        'national_identity_card.pdf'
      )
      confirm.verifyUnsuppoertedFileError(copy)
    })

    it('should upload selfie', async () => {
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
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'face.jpeg')
      verificationComplete.verifyUIElements(copy)
      verificationComplete.checkBackArrowIsNotDisplayed()
    })

    it('should take one selfie using the camera stream', async () => {
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
      selfieIntro.verifyUIElementsOnTheSelfieIntroScreen(copy)
      selfieIntro.clickOnContinueButton()
      camera.verifySelfieTitle(copy)
      camera.takeSelfie()
      confirm.clickConfirmButton()
      verificationComplete.verifyUIElements(copy)
      verificationComplete.checkBackArrowIsNotDisplayed()
    })

    it('should complete the flow when snapshot is disabled', async () => {
      goToPassportUploadScreen(
        driver,
        welcome,
        documentSelector,
        `?language=${lang}&useMultipleSelfieCapture=false`
      )
      documentUpload.clickUploadButton()
      uploadFileAndClickConfirmButton(
        passportUploadImageGuide,
        confirm,
        'passport.jpg'
      )
      selfieIntro.verifyUIElementsOnTheSelfieIntroScreen(copy)
      selfieIntro.clickOnContinueButton()
      camera.takeSelfie()
      confirm.clickConfirmButton()
      verificationComplete.verifyUIElements(copy)
      verificationComplete.checkBackArrowIsNotDisplayed()
    })

    // TODO: Bring back these tests once the face detection service is re-enabled
    // it('should return no face found error for selfie', async () => {
    //   goToPassportUploadScreen(driver, welcome, documentSelector,`?language=${lang}&useUploader=true`)
    //   uploadFileAndClickConfirmButton(documentUpload, confirm, 'passport.jpg')
    //   uploadFileAndClickConfirmButton(documentUpload, confirm, 'llama.jpg')
    //   confirm.verifyNoFaceError(copy)
    // })

    // it('should return multiple faces error', async () => {
    //   goToPassportUploadScreen(driver, welcome, documentSelector,`?language=${lang}&useUploader=true`)
    //   uploadFileAndClickConfirmButton(documentUpload, confirm, 'passport.jpg')
    //   uploadFileAndClickConfirmButton(documentUpload, confirm, 'two_faces.jpg')
    //   confirm.verifyMultipleFacesError(copy)
    // })

    it('should be taken to the cross-device flow for selfie capture there is no camera and liveness variant requested', async () => {
      goToPassportUploadScreen(
        driver,
        welcome,
        documentSelector,
        `?language=${lang}&liveness=true`
      )
      driver.executeScript(
        'window.navigator.mediaDevices.enumerateDevices = () => Promise.resolve([])'
      )
      documentUpload.clickUploadButton()
      uploadFileAndClickConfirmButton(
        passportUploadImageGuide,
        confirm,
        'passport.jpg'
      )
      crossDeviceIntro.verifyTitle(copy)
    })

    it('should be taken to the selfie screen if browser does not have MediaRecorder API and liveness variant requested', async () => {
      goToPassportUploadScreen(
        driver,
        welcome,
        documentSelector,
        `?language=${lang}&liveness=true`
      )
      driver.executeScript(
        'window.navigator.mediaDevices.enumerateDevices = () => Promise.resolve([{ kind: "video" }])'
      )
      driver.executeScript('window.MediaRecorder = undefined')
      documentUpload.clickUploadButton()
      uploadFileAndClickConfirmButton(
        passportUploadImageGuide,
        confirm,
        'passport.jpg'
      )
      selfieIntro.verifyUIElementsOnTheSelfieIntroScreen(copy)
      selfieIntro.clickOnContinueButton()
      cameraPermissions.verifyUIElementsOnTheCameraPermissionsScreen(copy)
    })

    it('should enter the liveness flow if I have a camera and liveness variant requested', async () => {
      goToPassportUploadScreen(
        driver,
        welcome,
        documentSelector,
        `?language=${lang}&liveness=true`
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
      livenessIntro.verifyUIElementsOnTheLivenessIntroScreen(copy)
      livenessIntro.clickOnContinueButton()
    })

    it('should enter the liveness flow and display timeout notification after 10 seconds', async () => {
      goToPassportUploadScreen(
        driver,
        welcome,
        documentSelector,
        `?language=${lang}&liveness=true`
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
      livenessIntro.verifyUIElementsOnTheLivenessIntroScreen(copy)
      livenessIntro.clickOnContinueButton()
      camera.continueButton().click()
      driver.wait(until.elementIsVisible(camera.warningMessage()), 10000)
      assert.isFalse(
        camera.isOverlayPresent(),
        'Test Failed: Face overlay should not be displayed'
      )
    })

    it('should record a video with live challenge, play it and submit it', async () => {
      goToPassportUploadScreen(
        driver,
        welcome,
        documentSelector,
        `?language=${lang}&liveness=true`
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
      livenessIntro.verifyUIElementsOnTheLivenessIntroScreen(copy)
      livenessIntro.clickOnContinueButton()
      camera.continueButton().click()
      camera.verifyVideoTitle(copy)
      camera.recordButton().click()
      assert.isTrue(
        camera.isOverlayPresent(),
        'Test Failed: Face overlay should be displayed'
      )
      camera.completeChallenges()
      confirm.playVideoBeforeConfirm()
      confirm.clickConfirmButton()
      verificationComplete.backArrow().isDisplayed()
      verificationComplete.verifyUIElements(copy)
      verificationComplete.checkBackArrowIsNotDisplayed()
    })

    it('should hide the logo if using valid enterprise SDK Token and hideOnfidoLogo is enabled for liveness variant', async () => {
      goToPassportUploadScreen(
        driver,
        welcome,
        documentSelector,
        `?language=${lang}&liveness=true&hideOnfidoLogo=true`
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
      livenessIntro.checkLogoIsHidden()
      livenessIntro.clickOnContinueButton()
      camera.checkLogoIsHidden()
      camera.recordVideo()
      camera.completeChallenges()
      confirm.checkLogoIsHidden()
      confirm.clickConfirmButton()
      verificationComplete.checkLogoIsHidden()
    })

    it('should show the cobrand text and logo if using valid enterprise SDK Token and showCobrand is enabled for liveness variant', async () => {
      goToPassportUploadScreen(
        driver,
        welcome,
        documentSelector,
        `?language=${lang}&liveness=true&showCobrand=true`
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
      livenessIntro.checkCobrandIsVisible()
      livenessIntro.clickOnContinueButton()
      camera.checkCobrandIsVisible()
      camera.recordVideo()
      camera.completeChallenges()
      confirm.checkCobrandIsVisible()
      confirm.clickConfirmButton()
      verificationComplete.checkCobrandIsVisible()
    })

    it('should not show any logo, including cobrand text and logo if both showCobrand and hideOnfidoLogo are enabled for liveness variant', async () => {
      goToPassportUploadScreen(
        driver,
        welcome,
        documentSelector,
        `?language=${lang}&liveness=true&showCobrand=true&hideOnfidoLogo=true`
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
      livenessIntro.checkLogoIsHidden()
      livenessIntro.clickOnContinueButton()
      camera.checkLogoIsHidden()
      camera.recordVideo()
      camera.completeChallenges()
      confirm.checkLogoIsHidden()
      confirm.clickConfirmButton()
      verificationComplete.checkLogoIsHidden()
    })
  })
}
