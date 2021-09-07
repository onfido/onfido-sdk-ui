import { assert } from 'chai'
import { until } from 'selenium-webdriver'
import { describe, it } from '../../utils/mochaw'
import {
  goToPassportUploadScreen,
  uploadFileAndClickConfirmButton,
  takePercySnapshot,
  takePercySnapshotWithoutOverlay,
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

    it('should upload selfie @e2e-latest', async () => {
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

    it('should take one selfie using the camera stream @percy', async () => {
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
      camera.enableCameraAccessIfNecessary()
      camera.verifySelfieTitle(copy)
      camera.verifyOnfidoFooterIsVisible()
      await takePercySnapshotWithoutOverlay(
        driver,
        `Verify Take a selfie overlay screen ${lang}`
      )
      camera.takeSelfie()
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
      camera.enableCameraAccessIfNecessary()
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

    it('should be taken to the cross-device flow if browser does not have MediaRecorder API, facial liveness video variant requested and photoCaptureFallback is disabled', async () => {
      goToPassportUploadScreen(
        driver,
        welcome,
        documentSelector,
        `?language=${lang}&faceVideo=true&photoCaptureFallback=false`
      )
      driver.executeScript('window.MediaRecorder = undefined')
      documentUpload.clickUploadButton()
      uploadFileAndClickConfirmButton(
        passportUploadImageGuide,
        confirm,
        'passport.jpg'
      )
      driver.wait(until.elementIsVisible(crossDeviceIntro.title()), 2500)
      crossDeviceIntro.verifyTitle(copy)
    })

    it('should enter the facial liveness video flow if I have a camera and liveness video variant requested @percy', async () => {
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
      await takePercySnapshot(
        driver,
        `Verify Let’s make sure nobody’s impersonating you screen is seen ${lang}`
      )
      faceVideoIntro.clickOnContinueButton()
      camera.enableCameraAccessForPercy()
      await takePercySnapshotWithoutOverlay(
        driver,
        `Verify Position your face in the oval overlay screen is seen ${lang}`
      )
    })

    it('should enter the facial liveness video flow and display timeout notification after 10 seconds @percy', async () => {
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
      camera.enableCameraButton().click()
      driver.wait(until.elementIsVisible(camera.warningMessage()), 10000)
      assert.isFalse(
        camera.isOverlayPresent(),
        'Test Failed: Face overlay should not be displayed'
      )
      await takePercySnapshotWithoutOverlay(
        driver,
        `Verify is your camera working pop-up is displayed ${lang}`
      )
    })

    it('should record a video with liveness challenge, play it and submit it @percy', async () => {
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

    it('should hide the logo if using valid enterprise SDK Token and hideOnfidoLogo is enabled for facial liveness video @percy', async () => {
      goToPassportUploadScreen(
        driver,
        welcome,
        documentSelector,
        `?language=${lang}&faceVideo=true&hideOnfidoLogo=true`
      )
      driver.executeScript(
        'window.navigator.mediaDevices.enumerateDevices = () => Promise.resolve([{ kind: "video" }])'
      )
      await takePercySnapshot(
        driver,
        `Verify Submit passport photo screen does not have onfido logo ${lang}`
      )
      documentUpload.clickUploadButton()
      uploadFileAndClickConfirmButton(
        passportUploadImageGuide,
        confirm,
        'passport.jpg'
      )
      faceVideoIntro.checkLogoIsHidden()
      await takePercySnapshot(
        driver,
        `Verify Let’s make sure nobody’s impersonating you screen does not have onfido logo ${lang}`
      )
      faceVideoIntro.clickOnContinueButton()
      camera.checkLogoIsHidden()
      camera.enableCameraButton().click()
      await takePercySnapshotWithoutOverlay(
        driver,
        `Verify Position your face in the oval overlay screen does not have onfido logo ${lang}`
      )
      camera.recordButton().click()
      await takePercySnapshotWithoutOverlay(
        driver,
        `Movement challenge is given ${lang}`
      )
      camera.nextChallengeButton().click()
      await takePercySnapshotWithoutOverlay(
        driver,
        `Vocal challenge is given ${lang}`
      )
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
        `Verify Verification complete screen does not have Onfido logo ${lang}`
      )
    })

    it('should show the cobrand text and logo if using valid enterprise SDK Token and showCobrand is enabled for facial liveness video @percy', async () => {
      goToPassportUploadScreen(
        driver,
        welcome,
        documentSelector,
        `?language=${lang}&faceVideo=true&showCobrand=true`
      )
      driver.executeScript(
        'window.navigator.mediaDevices.enumerateDevices = () => Promise.resolve([{ kind: "video" }])'
      )
      await takePercySnapshot(
        driver,
        `Verify Submit passport photo screen does has co-brand logo ${lang}`
      )
      documentUpload.clickUploadButton()
      uploadFileAndClickConfirmButton(
        passportUploadImageGuide,
        confirm,
        'passport.jpg'
      )
      faceVideoIntro.checkCobrandIsVisible()
      await takePercySnapshot(
        driver,
        `Verify Let’s make sure nobody’s impersonating you screen has co-brand logo ${lang}`
      )
      faceVideoIntro.clickOnContinueButton()
      camera.checkCobrandIsVisible()
      camera.enableCameraButton().click()
      await takePercySnapshotWithoutOverlay(
        driver,
        `Verify Position your face in the oval overlay screen has co-brand logo ${lang}`
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

    it('should not show any logo, including cobrand text and logo if both showCobrand and hideOnfidoLogo are enabled for facial liveness video', async () => {
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
      camera.enableCameraAccessIfNecessary()
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
      camera.enableCameraAccessIfNecessary()
      camera.takeSelfie()
      confirm.clickConfirmButton()
    })
  })
}
