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
        await documentUpload.getUploadInput()
        documentUpload.upload('face.jpeg')
        await confirm.clickBackArrow()
        await documentUpload.verifySelfieUploadTitle(copy)
        await documentUpload.clickBackArrow()
        await confirm.verifyCheckReadabilityMessage(copy)
        await confirm.clickBackArrow()
        passportUploadImageGuide.verifyTitle(copy)
        await passportUploadImageGuide.clickBackArrow()
        await documentUpload.verifyPassportTitle(copy)
        await documentUpload.clickBackArrow()
        documentSelector.verifyTitle(copy)
        await documentSelector.clickBackArrow()
        welcome.verifyTitle(copy)
        await welcome.checkBackArrowIsNotDisplayed()
      })

      it('should display the face video intro again on back button click when on the face video flow and I have a camera', async () => {
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
        await camera.recordVideo()
        await camera.clickBackArrow()
        await faceVideoIntro.verifyUIElementsOnTheFaceVideoIntroScreen(copy)
      })
    }
  )
}
