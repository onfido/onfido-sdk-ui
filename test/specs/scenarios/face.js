import { assert } from 'chai'
import { until } from 'selenium-webdriver'
import { describe, it } from '../../utils/mochaw'
import {
  goToPassportUploadScreen,
  uploadFileAndClickConfirmButton,
  takePercySnapshot,
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
      await takePercySnapshot(driver, `Verify Take a selfie screen ${lang}`)
      selfieIntro.clickOnContinueButton()
      camera.verifySelfieTitle(copy)
      camera.verifyOnfidoFooterIsVisible()
      await takePercySnapshot(
        driver,
        `Verify Take a selfie overlay screen ${lang}`,
        {
          percyCSS: `video.onfido-sdk-ui-Camera-video { display: none; }`,
        }
      )
      camera.takeSelfie()
      //Might need to remove a CSS component as the preview image would change
      //onfido-sdk-ui-Confirm-CaptureViewer-imageWrapper
      await takePercySnapshot(
        driver,
        `Verify Check selfie preview screen ${lang}`
      )
      confirm.clickConfirmButton()
      verificationComplete.verifyUIElements(copy)
      verificationComplete.checkBackArrowIsNotDisplayed()
      await takePercySnapshot(
        driver,
        `Verify Verification complete screen ${lang}`
      )
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

    it('should be taken to the cross-device flow for selfie capture if there is no camera and liveness variant requested', async () => {
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

      /**
       * @FIXME: the screen "Let's make sure nobody's impersonating you"
       * unusually displays for about 2 seconds then disappears
       */
      await sleep(2500)
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
      await takePercySnapshot(
        driver,
        `Verify Let’s make sure nobody’s impersonating you screen is seen ${lang}`
      )
      livenessIntro.clickOnContinueButton()
      await takePercySnapshot(
        driver,
        `Verify Position your face in the oval overlay screen is seen ${lang}`
      )
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
      camera.enableCameraButton().click()
      driver.wait(until.elementIsVisible(camera.warningMessage()), 10000)
      assert.isFalse(
        camera.isOverlayPresent(),
        'Test Failed: Face overlay should not be displayed'
      )
      await takePercySnapshot(
        driver,
        `Verify is your camera working pop-up is displayed ${lang}`
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
      camera.enableCameraButton().click()
      camera.verifyVideoTitle(copy)
      camera.verifyOnfidoFooterIsVisible()
      camera.recordButton().click()
      assert.isTrue(
        camera.isOverlayPresent(),
        'Test Failed: Face overlay should be displayed'
      )
      camera.completeChallenges()
      await takePercySnapshot(
        driver,
        `Verify Check selfie video screen is seen with time at 0:00 ${lang}`
      )
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
      await takePercySnapshot(
        driver,
        `Verify Submit passport photo page does not have onfido logo ${lang}`
      )
      documentUpload.clickUploadButton()
      uploadFileAndClickConfirmButton(
        passportUploadImageGuide,
        confirm,
        'passport.jpg'
      )
      livenessIntro.checkLogoIsHidden()
      await takePercySnapshot(
        driver,
        `Verify Let’s make sure nobody’s impersonating you screen does not have onfido logo ${lang}`
      )
      livenessIntro.clickOnContinueButton()
      camera.checkLogoIsHidden()
      camera.enableCameraButton().click()
      await takePercySnapshot(
        driver,
        `Verify Position your face in the oval overlay screen does not have onfido logo ${lang}`,
        { percyCSS: `video.onfido-sdk-ui-Camera-video { display: none; }` }
      )
      camera.recordButton().click()
      await takePercySnapshot(driver, `Movement challenge is given ${lang}`, {
        percyCSS: `video.onfido-sdk-ui-Camera-video { display: none; }`,
      })
      camera.nextChallengeButton().click()
      await takePercySnapshot(driver, `Vocal challenge is given ${lang}`, {
        percyCSS: `video.onfido-sdk-ui-Camera-video { display: none; }`,
      })
      camera.stopButton().click()
      confirm.checkLogoIsHidden()
      await takePercySnapshot(
        driver,
        `Verify Check selfie video screen does not have onfido logo ${lang}`
      )
      confirm.clickConfirmButton()
      verificationComplete.checkLogoIsHidden()
      await takePercySnapshot(
        driver,
        `Verify Verification complete screen does not have onfido logo ${lang}`
      )
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
      await takePercySnapshot(
        driver,
        `Verify Submit passport photo page does has co-brand logo ${lang}`
      )
      documentUpload.clickUploadButton()
      uploadFileAndClickConfirmButton(
        passportUploadImageGuide,
        confirm,
        'passport.jpg'
      )
      livenessIntro.checkCobrandIsVisible()
      await takePercySnapshot(
        driver,
        `Verify Let’s make sure nobody’s impersonating you screen has co-brand logo ${lang}`
      )
      livenessIntro.clickOnContinueButton()
      camera.checkCobrandIsVisible()
      camera.enableCameraButton().click()
      await takePercySnapshot(
        driver,
        `Verify Position your face in the oval overlay screen has co-brand logo ${lang}`,
        { percyCSS: `video.onfido-sdk-ui-Camera-video { display: none; }` }
      )
      camera.recordButton().click()
      camera.completeChallenges()
      confirm.checkCobrandIsVisible()
      await takePercySnapshot(
        driver,
        `Verify Check selfie video screen has co-brand logo ${lang}`
      )
      confirm.clickConfirmButton()
      verificationComplete.checkCobrandIsVisible()
      await takePercySnapshot(
        driver,
        `Verify Verification complete screen has co-brand logo ${lang}`
      )
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

    it('should continue through full flow without problems when using customized API requests but still uploading media to API as normal', async () => {
      goToPassportUploadScreen(
        driver,
        welcome,
        documentSelector,
        `?language=${lang}&useCustomizedApiRequests=true&decoupleResponse=onfido`
      )
      documentUpload.clickUploadButton()
      uploadFileAndClickConfirmButton(
        passportUploadImageGuide,
        confirm,
        'passport.jpg'
      )
      selfieIntro.clickOnContinueButton()
      camera.takeSelfie()
      confirm.clickConfirmButton()
    })

    it('should continue through full flow without problems when using customized API requests and success response is returned from callbacks', async () => {
      goToPassportUploadScreen(
        driver,
        welcome,
        documentSelector,
        `?language=${lang}&useCustomizedApiRequests=true&decoupleResponse=success`
      )
      documentUpload.clickUploadButton()
      uploadFileAndClickConfirmButton(
        passportUploadImageGuide,
        confirm,
        'passport.jpg'
      )
      selfieIntro.clickOnContinueButton()
      camera.takeSelfie()
      confirm.clickConfirmButton()
    })
  })
}
