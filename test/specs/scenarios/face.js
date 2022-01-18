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

    // FIXME: To be fixed in CX-7126
    it.skip('should record a video with liveness challenge, play it and submit it @percy', async () => {
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

    it.skip('should hide the logo if using valid enterprise SDK Token and hideOnfidoLogo is enabled for facial liveness video @percy', async () => {
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

    it.skip('should show the cobrand text and logo if using valid enterprise SDK Token and showCobrand is enabled for facial liveness video @percy', async () => {
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
      verificationComplete.verifyUIElements()
      verificationComplete.checkCobrandIsVisible()
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
  })
}
