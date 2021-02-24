import { assert } from 'chai'
import { until } from 'selenium-webdriver'
import { describe, it } from '../../utils/mochaw'
import {
  goToPassportUploadScreen,
  uploadFileAndClickConfirmButton,
} from './sharedFlows.js'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

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
    'FaceVideoIntro',
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
      faceVideoIntro,
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

    it('should successfully upload a resized image if selfie image file is too large', async () => {
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
        'over_10mb_face.jpg'
      )
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

    // @TODO: Bring back these tests once the face detection service is re-enabled
    it.skip('should return no face found error for selfie', async () => {
      goToPassportUploadScreen(
        driver,
        welcome,
        documentSelector,
        `?language=${lang}&useUploader=true`
      )
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'passport.jpg')
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'llama.jpg')
      confirm.verifyNoFaceError(copy)
    })

    // @TODO: Bring back these tests once the face detection service is re-enabled
    it.skip('should return multiple faces error', async () => {
      goToPassportUploadScreen(
        driver,
        welcome,
        documentSelector,
        `?language=${lang}&useUploader=true`
      )
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'passport.jpg')
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'two_faces.jpg')
      confirm.verifyMultipleFacesError(copy)
    })

    it('should be taken to the cross-device flow for selfie capture if there is no camera and faceVideo variant requested', async () => {
      goToPassportUploadScreen(
        driver,
        welcome,
        documentSelector,
        `?language=${lang}&faceVideo=true`
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

      /**
       * @FIXME: the screen "Let's make sure nobody's impersonating you"
       * unusually displays for about 2 seconds then disappears
       */
      await sleep(2500)
      crossDeviceIntro.verifyTitle(copy)
    })

    it('should be taken to the selfie screen if browser does not have MediaRecorder API and faceVideo variant requested', async () => {
      goToPassportUploadScreen(
        driver,
        welcome,
        documentSelector,
        `?language=${lang}&faceVideo=true`
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

    it('should enter the faceVideo flow if I have a camera and faceVideo variant requested', async () => {
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
    })

    it('should enter the faceVideo flow and display timeout notification after 10 seconds', async () => {
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

    it('should hide the logo if using valid enterprise SDK Token and hideOnfidoLogo is enabled for faceVideo variant', async () => {
      goToPassportUploadScreen(
        driver,
        welcome,
        documentSelector,
        `?language=${lang}&faceVideo=true&hideOnfidoLogo=true`
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
      faceVideoIntro.checkLogoIsHidden()
      faceVideoIntro.clickOnContinueButton()
      camera.checkLogoIsHidden()
      camera.recordVideo()
      camera.completeChallenges()
      confirm.checkLogoIsHidden()
      confirm.clickConfirmButton()
      verificationComplete.checkLogoIsHidden()
    })

    it('should show the cobrand text and logo if using valid enterprise SDK Token and showCobrand is enabled for faceVideo variant', async () => {
      goToPassportUploadScreen(
        driver,
        welcome,
        documentSelector,
        `?language=${lang}&faceVideo=true&showCobrand=true`
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
      faceVideoIntro.checkCobrandIsVisible()
      faceVideoIntro.clickOnContinueButton()
      camera.checkCobrandIsVisible()
      camera.recordVideo()
      camera.completeChallenges()
      confirm.checkCobrandIsVisible()
      confirm.clickConfirmButton()
      verificationComplete.checkCobrandIsVisible()
    })

    it('should not show any logo, including cobrand text and logo if both showCobrand and hideOnfidoLogo are enabled for faceVideo variant', async () => {
      goToPassportUploadScreen(
        driver,
        welcome,
        documentSelector,
        `?language=${lang}&faceVideo=true&showCobrand=true&hideOnfidoLogo=true`
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
      faceVideoIntro.checkLogoIsHidden()
      faceVideoIntro.clickOnContinueButton()
      camera.checkLogoIsHidden()
      camera.recordVideo()
      camera.completeChallenges()
      confirm.checkLogoIsHidden()
      confirm.clickConfirmButton()
      verificationComplete.checkLogoIsHidden()
    })
  })
}
