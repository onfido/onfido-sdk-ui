import { it } from '../../utils/mochaw'
import { goToPassportUploadScreen, uploadFileAndClickConfirmButton } from './sharedFlows.js'

export const FaceScenarios = (driver, screens, lang) => {
  const { documentUploadConfirmation, verificationComplete} = screens

  describe(`FACE STEPS in ${lang}`, () => {
    // All these copy should be deleted!
    const documentUploadConfirmationCopy = documentUploadConfirmation.copy(lang)
    const verificationCompleteCopy = verificationComplete.copy(lang)

    it('should return unsupported file type error for selfie', async () => {
      goToPassportUploadScreen(driver, screens, `?language=${lang}&async=false&useWebcam=false`)
      uploadFileAndClickConfirmButton(screens, 'passport.jpg')
      uploadFileAndClickConfirmButton(screens, 'national_identity_card.pdf')
      documentUploadConfirmation.verifyUnsuppoertedFileError(documentUploadConfirmationCopy)
    })

    it('should upload selfie', async () => {
      goToPassportUploadScreen(driver, screens,`?language=${lang}&async=false&useWebcam=false`)
      uploadFileAndClickConfirmButton(screens, 'passport.jpg')
      uploadFileAndClickConfirmButton(screens, 'face.jpeg')
      verificationComplete.verifyUIElements(verificationCompleteCopy)
      verificationComplete.checkBackArrowIsNotDisplayed()
    })

    it('should take one selfie using the camera stream', async () => {
      goToPassportUploadScreen(driver, screens,`?language=${lang}&async=false`)
      uploadFileAndClickConfirmButton(screens, 'passport.jpg')
      documentUploadConfirmation.takeSelfie()
      documentUploadConfirmation.confirmBtn.click()
      verificationComplete.verifyUIElements(verificationCompleteCopy)
      verificationComplete.checkBackArrowIsNotDisplayed()
    })

    it('should take multiple selfies using the camera stream', async () => {
      goToPassportUploadScreen(driver, screens,`?language=${lang}&async=false&useMultipleSelfieCapture=true`)
      uploadFileAndClickConfirmButton(screens, 'passport.jpg')
      documentUploadConfirmation.takeSelfie()
      documentUploadConfirmation.confirmBtn.click()
      verificationComplete.verifyUIElements(verificationCompleteCopy)
      verificationComplete.checkBackArrowIsNotDisplayed()
    })

    it('should return no face found error for selfie', async () => {
      goToPassportUploadScreen(driver, screens,`?language=${lang}&async=false&useWebcam=false`)
      uploadFileAndClickConfirmButton(screens, 'passport.jpg')
      uploadFileAndClickConfirmButton(screens, 'llama.jpg')
      documentUploadConfirmation.verifyNoFaceError(documentUploadConfirmationCopy)
    })

    it('should return multiple faces error', async () => {
      goToPassportUploadScreen(driver, screens,`?language=${lang}&async=false&useWebcam=false`)
      uploadFileAndClickConfirmButton(screens, 'passport.jpg')
      uploadFileAndClickConfirmButton(screens, 'two_faces.jpg')
      documentUploadConfirmation.verifyMultipleFacesError(documentUploadConfirmationCopy)
    })

  })
}
