import { describe, it } from '../../utils/mochaw'
import {
  goToPassportUploadScreen,
  uploadFileAndClickConfirmButton,
} from './sharedFlows.js'

const options = {
  pageObjects: [
    'Welcome',
    'DocumentSelector',
    'PassportUploadImageGuide',
    'DocumentUpload',
    'FaceVideoIntro',
    'Camera',
    'Confirm',
    'BasePage',
  ],
}
export const navigationScenarios = async (lang) => {
  describe(
    `NAVIGATION scenarios in ${lang}`,
    options,
    ({ driver, pageObjects }) => {
      const {
        welcome,
        documentSelector,
        passportUploadImageGuide,
        documentUpload,
        faceVideoIntro,
        camera,
        confirm,
        basePage,
      } = pageObjects
      const copy = basePage.copy(lang)

      it('should navigate to the second-last step of the flow and then go back to the beginning', async () => {
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
        documentUpload.getUploadInput()
        documentUpload.upload('face.jpeg')
        confirm.clickBackArrow()
        documentUpload.verifySelfieUploadTitle(copy)
        documentUpload.clickBackArrow()
        confirm.verifyCheckReadabilityMessage(copy)
        confirm.clickBackArrow()
        passportUploadImageGuide.verifyTitle(copy)
        passportUploadImageGuide.clickBackArrow()
        documentUpload.verifyPassportTitle(copy)
        documentUpload.clickBackArrow()
        documentSelector.verifyTitle(copy)
        documentSelector.clickBackArrow()
        welcome.verifyTitle(copy)
        welcome.checkBackArrowIsNotDisplayed()
      })

      it('should display the face video intro again on back button click when on the face video flow and I have a camera', async () => {
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
        camera.recordVideo()
        camera.clickBackArrow()
        faceVideoIntro.verifyUIElementsOnTheFaceVideoIntroScreen(copy)
      })
    }
  )
}
