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
      await goToPassportUploadScreen(
        driver,
        welcome,
        documentSelector,
        `?language=${lang}&useUploader=true`
      )
      await documentUpload.clickUploadButton()
      await uploadFileAndClickConfirmButton(
        passportUploadImageGuide,
        confirm,
        'passport.jpg'
      )
      await uploadFileAndClickConfirmButton(
        documentUpload,
        confirm,
        'national_identity_card.pdf'
      )
      await confirm.verifyUnsuppoertedFileError(copy)
    })

    it('should upload selfie @e2e-latest', async () => {
      await goToPassportUploadScreen(
        driver,
        welcome,
        documentSelector,
        `?language=${lang}&useUploader=true`
      )
      await documentUpload.clickUploadButton()
      await uploadFileAndClickConfirmButton(
        passportUploadImageGuide,
        confirm,
        'passport.jpg'
      )
      await uploadFileAndClickConfirmButton(
        documentUpload,
        confirm,
        'face.jpeg'
      )
      verificationComplete.verifyUIElements(copy)
      await verificationComplete.checkBackArrowIsNotDisplayed()
    })

    it('should successfully upload a resized image if selfie image file is too large', async () => {
      await goToPassportUploadScreen(
        driver,
        welcome,
        documentSelector,
        `?language=${lang}&useUploader=true`
      )
      await documentUpload.clickUploadButton()
      await uploadFileAndClickConfirmButton(
        passportUploadImageGuide,
        confirm,
        'passport.jpg'
      )
      await uploadFileAndClickConfirmButton(
        documentUpload,
        confirm,
        'over_10mb_face.jpg'
      )
      verificationComplete.verifyUIElements(copy)
      await verificationComplete.checkBackArrowIsNotDisplayed()
    })

    it.skip('should take one selfie using the camera stream @percy', async () => {
      await goToPassportUploadScreen(
        driver,
        welcome,
        documentSelector,
        `?language=${lang}`
      )
      await documentUpload.clickUploadButton()
      await uploadFileAndClickConfirmButton(
        passportUploadImageGuide,
        confirm,
        'passport.jpg'
      )
      await selfieIntro.verifyUIElementsOnTheSelfieIntroScreen(copy)
      await takePercySnapshot(driver, `Verify Take a selfie screen ${lang}`)
      await selfieIntro.clickOnContinueButton()
      await camera.enableCameraAccessIfNecessary()
      await camera.verifySelfieTitle(copy)
      await camera.verifyOnfidoFooterIsVisible()
      await takePercySnapshotWithoutOverlay(
        driver,
        `Verify Take a selfie overlay screen ${lang}`
      )
      camera.takeSelfie()
      await takePercySnapshot(
        driver,
        `Verify Check selfie preview screen ${lang}`
      )
      await confirm.clickConfirmButton()
      verificationComplete.verifyUIElements(copy)
      await verificationComplete.checkBackArrowIsNotDisplayed()
      await takePercySnapshot(
        driver,
        `Verify Verification complete screen ${lang}`
      )
    })

    it('should complete the flow when snapshot is disabled', async () => {
      await goToPassportUploadScreen(
        driver,
        welcome,
        documentSelector,
        `?language=${lang}&useMultipleSelfieCapture=false`
      )
      await documentUpload.clickUploadButton()
      await uploadFileAndClickConfirmButton(
        passportUploadImageGuide,
        confirm,
        'passport.jpg'
      )
      await selfieIntro.verifyUIElementsOnTheSelfieIntroScreen(copy)
      await selfieIntro.clickOnContinueButton()
      await camera.enableCameraAccessIfNecessary()
      camera.takeSelfie()
      await confirm.clickConfirmButton()
      verificationComplete.verifyUIElements(copy)
      await verificationComplete.checkBackArrowIsNotDisplayed()
    })

    // @TODO: Bring back these tests once the face detection service is re-enabled
    it.skip('should return no face found error for selfie', async () => {
      await goToPassportUploadScreen(
        driver,
        welcome,
        documentSelector,
        `?language=${lang}&useUploader=true`
      )
      await uploadFileAndClickConfirmButton(
        documentUpload,
        confirm,
        'passport.jpg'
      )
      await uploadFileAndClickConfirmButton(
        documentUpload,
        confirm,
        'llama.jpg'
      )
      await confirm.verifyNoFaceError(copy)
    })

    // @TODO: Bring back these tests once the face detection service is re-enabled
    it.skip('should return multiple faces error', async () => {
      await goToPassportUploadScreen(
        driver,
        welcome,
        documentSelector,
        `?language=${lang}&useUploader=true`
      )
      await uploadFileAndClickConfirmButton(
        documentUpload,
        confirm,
        'passport.jpg'
      )
      await uploadFileAndClickConfirmButton(
        documentUpload,
        confirm,
        'two_faces.jpg'
      )
      await confirm.verifyMultipleFacesError(copy)
    })

    it('should be taken to the cross-device flow for selfie capture if there is no camera and faceVideo variant requested', async () => {
      await goToPassportUploadScreen(
        driver,
        welcome,
        documentSelector,
        `?language=${lang}&faceVideo=true`
      )
      driver.executeScript(
        'window.navigator.mediaDevices.enumerateDevices = () => Promise.resolve([])'
      )
      await documentUpload.clickUploadButton()
      await uploadFileAndClickConfirmButton(
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
      await goToPassportUploadScreen(
        driver,
        welcome,
        documentSelector,
        `?language=${lang}&faceVideo=true`
      )
      driver.executeScript(
        'window.navigator.mediaDevices.enumerateDevices = () => Promise.resolve([{ kind: "video" }])'
      )
      driver.executeScript('window.MediaRecorder = undefined')
      await documentUpload.clickUploadButton()
      await uploadFileAndClickConfirmButton(
        passportUploadImageGuide,
        confirm,
        'passport.jpg'
      )
      await selfieIntro.verifyUIElementsOnTheSelfieIntroScreen(copy)
      await selfieIntro.clickOnContinueButton()
      await cameraPermissions.verifyUIElementsOnTheCameraPermissionsScreen(copy)
    })

    it('should be taken to the cross-device flow if browser does not have MediaRecorder API, facial liveness video variant requested and photoCaptureFallback is disabled', async () => {
      await goToPassportUploadScreen(
        driver,
        welcome,
        documentSelector,
        `?language=${lang}&faceVideo=true&photoCaptureFallback=false`
      )
      driver.executeScript('window.MediaRecorder = undefined')
      await documentUpload.clickUploadButton()
      await uploadFileAndClickConfirmButton(
        passportUploadImageGuide,
        confirm,
        'passport.jpg'
      )
      driver.wait(until.elementIsVisible(crossDeviceIntro.title()), 2500)
      crossDeviceIntro.verifyTitle(copy)
    })

    it('should enter the facial liveness video flow if I have a camera and liveness video variant requested @percy', async () => {
      await goToPassportUploadScreen(
        driver,
        welcome,
        documentSelector,
        `?language=${lang}&faceVideo=true`
      )
      driver.executeScript(
        'window.navigator.mediaDevices.enumerateDevices = () => Promise.resolve([{ kind: "video" }])'
      )
      await documentUpload.clickUploadButton()
      await uploadFileAndClickConfirmButton(
        passportUploadImageGuide,
        confirm,
        'passport.jpg'
      )
      await faceVideoIntro.verifyUIElementsOnTheFaceVideoIntroScreen(copy)
      await takePercySnapshot(
        driver,
        `Verify Let’s make sure nobody’s impersonating you screen is seen ${lang}`
      )
      await faceVideoIntro.clickOnContinueButton()
      await camera.enableCameraAccessForPercy()
      await takePercySnapshotWithoutOverlay(
        driver,
        `Verify Position your face in the oval overlay screen is seen ${lang}`
      )
    })

    it('should enter the facial liveness video flow and display timeout notification after 10 seconds @percy', async () => {
      await goToPassportUploadScreen(
        driver,
        welcome,
        documentSelector,
        `?language=${lang}&faceVideo=true`
      )
      driver.executeScript(
        'window.navigator.mediaDevices.enumerateDevices = () => Promise.resolve([{ kind: "video" }])'
      )
      await documentUpload.clickUploadButton()
      await uploadFileAndClickConfirmButton(
        passportUploadImageGuide,
        confirm,
        'passport.jpg'
      )
      await faceVideoIntro.verifyUIElementsOnTheFaceVideoIntroScreen(copy)
      await faceVideoIntro.clickOnContinueButton()
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

    // FIXME: To be fixed in CX-7126
    it.skip('should record a video with liveness challenge, play it and submit it @percy', async () => {
      await goToPassportUploadScreen(
        driver,
        welcome,
        documentSelector,
        `?language=${lang}&faceVideo=true`
      )
      driver.executeScript(
        'window.navigator.mediaDevices.enumerateDevices = () => Promise.resolve([{ kind: "video" }])'
      )
      await documentUpload.clickUploadButton()
      await uploadFileAndClickConfirmButton(
        passportUploadImageGuide,
        confirm,
        'passport.jpg'
      )
      await faceVideoIntro.verifyUIElementsOnTheFaceVideoIntroScreen(copy)
      await faceVideoIntro.clickOnContinueButton()
      camera.enableCameraButton().click()
      await camera.verifyVideoTitle(copy)
      await camera.verifyOnfidoFooterIsVisible()
      camera.recordButton().click()
      assert.isTrue(
        camera.isOverlayPresent(),
        'Test Failed: Face overlay should be displayed'
      )
      await camera.completeChallenges()
      await takePercySnapshot(
        driver,
        `Verify Check selfie video screen is seen with time at 0:00 ${lang}`
      )
      await confirm.playVideoBeforeConfirm()
      await confirm.clickConfirmButton()
      await verificationComplete.backArrow().isDisplayed()
      verificationComplete.verifyUIElements(copy)
      await verificationComplete.checkBackArrowIsNotDisplayed()
    })

    it.skip('should hide the logo if using valid enterprise SDK Token and hideOnfidoLogo is enabled for facial liveness video @percy', async () => {
      await goToPassportUploadScreen(
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
      await documentUpload.clickUploadButton()
      await uploadFileAndClickConfirmButton(
        passportUploadImageGuide,
        confirm,
        'passport.jpg'
      )
      await faceVideoIntro.checkLogoIsHidden()
      await takePercySnapshot(
        driver,
        `Verify Let’s make sure nobody’s impersonating you screen does not have onfido logo ${lang}`
      )
      await faceVideoIntro.clickOnContinueButton()
      await camera.checkLogoIsHidden()
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
      await confirm.checkLogoIsHidden()
      await takePercySnapshot(
        driver,
        `Verify Check selfie video screen does not have onfido logo ${lang}`
      )
      await confirm.clickConfirmButton()
      await verificationComplete.checkLogoIsHidden()
      await takePercySnapshot(
        driver,
        `Verify Verification complete screen does not have Onfido logo ${lang}`
      )
    })

    it.skip('should show the cobrand text and logo if using valid enterprise SDK Token and showCobrand is enabled for facial liveness video @percy', async () => {
      await goToPassportUploadScreen(
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
      await documentUpload.clickUploadButton()
      await uploadFileAndClickConfirmButton(
        passportUploadImageGuide,
        confirm,
        'passport.jpg'
      )
      await faceVideoIntro.checkCobrandIsVisible()
      await takePercySnapshot(
        driver,
        `Verify Let’s make sure nobody’s impersonating you screen has co-brand logo ${lang}`
      )
      await faceVideoIntro.clickOnContinueButton()
      await camera.checkCobrandIsVisible()
      camera.enableCameraButton().click()
      await takePercySnapshotWithoutOverlay(
        driver,
        `Verify Position your face in the oval overlay screen has co-brand logo ${lang}`
      )
      camera.recordButton().click()
      await camera.completeChallenges()
      await confirm.checkCobrandIsVisible()
      await takePercySnapshot(
        driver,
        `Verify Check selfie video screen has co-brand logo ${lang}`
      )
      await confirm.clickConfirmButton()
      verificationComplete.verifyUIElements()
      await verificationComplete.checkCobrandIsVisible()
      // FIXME: This snapshot is currently producing a diff because flow is stuck on Confirm Upload screen
      //        with "Connection lost" popup error message.
      //        Above test passes because it is checking for a shared co-brand UI element in BasePage file.
      //        Adding verificationComplete.verifyUIElements(copy) check instead causes this test to fail
      //        as expected based on screenshot captured.
      await takePercySnapshot(
        driver,
        `Verify Verification complete screen has co-brand logo ${lang}`
      )
    })

    it('should not show any logo, including cobrand text and logo if both showCobrand and hideOnfidoLogo are enabled for facial liveness video', async () => {
      await goToPassportUploadScreen(
        driver,
        welcome,
        documentSelector,
        `?language=${lang}&faceVideo=true&showCobrand=true&hideOnfidoLogo=true`
      )
      driver.executeScript(
        'window.navigator.mediaDevices.enumerateDevices = () => Promise.resolve([{ kind: "video" }])'
      )
      await documentUpload.clickUploadButton()
      await uploadFileAndClickConfirmButton(
        passportUploadImageGuide,
        confirm,
        'passport.jpg'
      )
      await faceVideoIntro.checkLogoIsHidden()
      await faceVideoIntro.clickOnContinueButton()
      await camera.checkLogoIsHidden()
      await camera.recordVideo()
      await camera.completeChallenges()
      await confirm.checkLogoIsHidden()
      await confirm.clickConfirmButton()
      await verificationComplete.checkLogoIsHidden()
    })

    it('should continue through full flow without problems when using customized API requests but still uploading media to API as normal', async () => {
      await goToPassportUploadScreen(
        driver,
        welcome,
        documentSelector,
        `?language=${lang}&useCustomizedApiRequests=true&decoupleResponse=onfido`
      )
      await documentUpload.clickUploadButton()
      await uploadFileAndClickConfirmButton(
        passportUploadImageGuide,
        confirm,
        'passport.jpg'
      )
      await selfieIntro.clickOnContinueButton()
      await camera.enableCameraAccessIfNecessary()
      camera.takeSelfie()
      await confirm.clickConfirmButton()
    })

    it('should continue through full flow without problems when using customized API requests and success response is returned from callbacks', async () => {
      await goToPassportUploadScreen(
        driver,
        welcome,
        documentSelector,
        `?language=${lang}&useCustomizedApiRequests=true&decoupleResponse=success`
      )
      await documentUpload.clickUploadButton()
      await uploadFileAndClickConfirmButton(
        passportUploadImageGuide,
        confirm,
        'passport.jpg'
      )
      await selfieIntro.clickOnContinueButton()
      await camera.enableCameraAccessIfNecessary()
      camera.takeSelfie()
      await confirm.clickConfirmButton()
    })
  })
}
