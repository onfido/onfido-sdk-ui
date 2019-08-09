import { it } from '../../utils/mochaw'
import { goToPassportUploadScreen, uploadFileAndClickConfirmButton } from './sharedFlows.js'

export const faceScenarios = (driver, screens, lang) => {
  const {
    camera,
    crossDeviceIntro,
    cameraPermissions,
    confirm,
    livenessIntro,
    verificationComplete,
    basePage
  } = screens
  const copy = basePage.copy(lang)

  describe(`FACE scenarios in ${lang}`, () => {
    it('should return unsupported file type error for selfie', async () => {
      goToPassportUploadScreen(driver, screens, `?language=${lang}&async=false&useWebcam=false`)
      uploadFileAndClickConfirmButton(screens, 'passport.jpg')
      uploadFileAndClickConfirmButton(screens, 'national_identity_card.pdf')
      confirm.verifyUnsuppoertedFileError(copy)
    })

    it('should upload selfie', async () => {
      goToPassportUploadScreen(driver, screens,`?language=${lang}&async=false&useWebcam=false`)
      uploadFileAndClickConfirmButton(screens, 'passport.jpg')
      uploadFileAndClickConfirmButton(screens, 'face.jpeg')
      verificationComplete.verifyUIElements(copy)
      verificationComplete.checkBackArrowIsNotDisplayed()
    })

    it('should take one selfie using the camera stream', async () => {
      goToPassportUploadScreen(driver, screens,`?language=${lang}&async=false`)
      uploadFileAndClickConfirmButton(screens, 'passport.jpg')
      camera.takeSelfie()
      confirm.waitForConfirmBtnToBeLocated()
      confirm.confirmBtn.click()
      verificationComplete.verifyUIElements(copy)
      verificationComplete.checkBackArrowIsNotDisplayed()
    })

    it('should take multiple selfies using the camera stream', async () => {
      goToPassportUploadScreen(driver, screens,`?language=${lang}&async=false&useMultipleSelfieCapture=true`)
      uploadFileAndClickConfirmButton(screens, 'passport.jpg')
      camera.takeSelfie()
      confirm.confirmBtn.click()
      verificationComplete.verifyUIElements(copy)
      verificationComplete.checkBackArrowIsNotDisplayed()
    })

    it('should return no face found error for selfie', async () => {
      goToPassportUploadScreen(driver, screens,`?language=${lang}&async=false&useWebcam=false`)
      uploadFileAndClickConfirmButton(screens, 'passport.jpg')
      uploadFileAndClickConfirmButton(screens, 'llama.jpg')
      confirm.verifyNoFaceError(copy)
    })

    it('should return multiple faces error', async () => {
      goToPassportUploadScreen(driver, screens,`?language=${lang}&async=false&useWebcam=false`)
      uploadFileAndClickConfirmButton(screens, 'passport.jpg')
      uploadFileAndClickConfirmButton(screens, 'two_faces.jpg')
      confirm.verifyMultipleFacesError(copy)
    })

    it('should be taken to the cross-device flow if I do not have a camera and liveness variant requested', async () => {
      goToPassportUploadScreen(driver, screens,`?language=${lang}&liveness=true`)
      driver.executeScript('window.navigator.mediaDevices.enumerateDevices = () => Promise.resolve([])')
      uploadFileAndClickConfirmButton(screens, 'passport.jpg')
      crossDeviceIntro.verifyTitleForFace(copy)
    })

    it('should be taken to the selfie screen if browser does not have MediaRecorder API and liveness variant requested', async () => {
      goToPassportUploadScreen(driver, screens,`?language=${lang}&liveness=true`)
      driver.executeScript('window.navigator.mediaDevices.enumerateDevices = () => Promise.resolve([{ kind: "video" }])')
      driver.executeScript('window.MediaRecorder = undefined')
      uploadFileAndClickConfirmButton(screens, 'passport.jpg')
      cameraPermissions.verifyUIElementsOnTheCameraPermissionsScreen(copy)
    })

    it('should enter the liveness flow if I have a camera and liveness variant requested', async () => {
      goToPassportUploadScreen(driver, screens,`?language=${lang}&liveness=true`)
      driver.executeScript('window.navigator.mediaDevices.enumerateDevices = () => Promise.resolve([{ kind: "video" }])')
      uploadFileAndClickConfirmButton(screens, 'passport.jpg')
      livenessIntro.verifyUIElementsOnTheLivenessIntroScreen(copy)
      livenessIntro.clickOnContinueButton()
    })

    it('should record a video with live challenge, play it and submit it', async () => {
      goToPassportUploadScreen(driver, screens,`?language=${lang}&liveness=true`)
      driver.executeScript('window.navigator.mediaDevices.enumerateDevices = () => Promise.resolve([{ kind: "video" }])')
      uploadFileAndClickConfirmButton(screens, 'passport.jpg')
      livenessIntro.verifyUIElementsOnTheLivenessIntroScreen(copy)
      livenessIntro.clickOnContinueButton()
      camera.startVideoRecording()
      camera.completeChallenges()
      confirm.playVideoBeforeConfirm()
      confirm.confirmBtn.click()
      verificationComplete.waitForIconToBeLocated()
      verificationComplete.verifyUIElements(copy)
      verificationComplete.checkBackArrowIsNotDisplayed()
    })
  })
}
