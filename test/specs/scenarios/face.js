import { describe, it } from '../../utils/mochaw'
import { goToPassportUploadScreen, uploadFileAndClickConfirmButton } from './sharedFlows.js'

const options = {
  pageObjects: [
    'Welcome',
    'Camera',
    'CrossDeviceIntro',
    'CameraPermissions',
    'Confirm',
    'DocumentSelector',
    'DocumentUpload',
    'LivenessIntro',
    'VerificationComplete',
    'BasePage'
  ]
}

export const faceScenarios = (lang) => {
  describe(`FACE scenarios in ${lang}`, options, ({driver, pageObjects}) => {
    const {
      welcome,
      camera,
      crossDeviceIntro,
      cameraPermissions,
      confirm,
      documentSelector,
      documentUpload,
      livenessIntro,
      verificationComplete,
      basePage
    } = pageObjects

    const copy = basePage.copy(lang)

    it('should return unsupported file type error for selfie', async () => {
      goToPassportUploadScreen(driver, welcome, documentSelector, `?language=${lang}&async=false&useWebcam=false`)
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'passport.jpg')
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'national_identity_card.pdf')
      confirm.verifyUnsuppoertedFileError(copy)
    })

    it('should upload selfie', async () => {
      goToPassportUploadScreen(driver, welcome, documentSelector,`?language=${lang}&async=false&useWebcam=false`)
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'passport.jpg')
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'face.jpeg')
      verificationComplete.verifyUIElements(copy)
      verificationComplete.checkBackArrowIsNotDisplayed()
    })

    it('should take one selfie using the camera stream', async () => {
      goToPassportUploadScreen(driver, welcome, documentSelector,`?language=${lang}&async=false`)
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'passport.jpg')
      camera.takeSelfie()
      confirm.confirmBtn.click()
      verificationComplete.verifyUIElements(copy)
      verificationComplete.checkBackArrowIsNotDisplayed()
    })

    it('should take multiple selfies using the camera stream', async () => {
      goToPassportUploadScreen(driver, welcome, documentSelector,`?language=${lang}&async=false&useMultipleSelfieCapture=true`)
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'passport.jpg')
      camera.takeSelfie()
      confirm.confirmBtn.click()
      verificationComplete.verifyUIElements(copy)
      verificationComplete.checkBackArrowIsNotDisplayed()
    })

    it('should return no face found error for selfie', async () => {
      goToPassportUploadScreen(driver, welcome, documentSelector,`?language=${lang}&async=false&useWebcam=false`)
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'passport.jpg')
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'llama.jpg')
      confirm.verifyNoFaceError(copy)
    })

    it('should return multiple faces error', async () => {
      goToPassportUploadScreen(driver, welcome, documentSelector,`?language=${lang}&async=false&useWebcam=false`)
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'passport.jpg')
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'two_faces.jpg')
      confirm.verifyMultipleFacesError(copy)
    })

    it('should be taken to the cross-device flow if I do not have a camera and liveness variant requested', async () => {
      goToPassportUploadScreen(driver, welcome, documentSelector,`?language=${lang}&liveness=true`)
      driver.executeScript('window.navigator.mediaDevices.enumerateDevices = () => Promise.resolve([])')
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'passport.jpg')
      crossDeviceIntro.verifyTitleForFace(copy)
    })

    it('should be taken to the selfie screen if browser does not have MediaRecorder API and liveness variant requested', async () => {
      goToPassportUploadScreen(driver, welcome, documentSelector,`?language=${lang}&liveness=true`)
      driver.executeScript('window.navigator.mediaDevices.enumerateDevices = () => Promise.resolve([{ kind: "video" }])')
      driver.executeScript('window.MediaRecorder = undefined')
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'passport.jpg')
      cameraPermissions.verifyUIElementsOnTheCameraPermissionsScreen(copy)
    })

    it('should enter the liveness flow if I have a camera and liveness variant requested', async () => {
      goToPassportUploadScreen(driver, welcome, documentSelector,`?language=${lang}&liveness=true`)
      driver.executeScript('window.navigator.mediaDevices.enumerateDevices = () => Promise.resolve([{ kind: "video" }])')
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'passport.jpg')
      livenessIntro.verifyUIElementsOnTheLivenessIntroScreen(copy)
      livenessIntro.clickOnContinueButton()
    })

    it('should record a video with live challenge, play it and submit it', async () => {
      goToPassportUploadScreen(driver, welcome, documentSelector,`?language=${lang}&liveness=true`)
      driver.executeScript('window.navigator.mediaDevices.enumerateDevices = () => Promise.resolve([{ kind: "video" }])')
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'passport.jpg')
      livenessIntro.verifyUIElementsOnTheLivenessIntroScreen(copy)
      livenessIntro.clickOnContinueButton()
      camera.startVideoRecording()
      camera.completeChallenges()
      confirm.playVideoBeforeConfirm()
      confirm.confirmBtn.click()
      verificationComplete.verifyUIElements(copy)
      verificationComplete.checkBackArrowIsNotDisplayed()
    })
  })
}
