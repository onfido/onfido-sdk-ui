import { describe, it } from '../../utils/mochaw'
import { goToPassportUploadScreen, uploadFileAndClickConfirmButton } from './sharedFlows.js'

export const navigationScenarios = (driver, screens, lang) => {
  const { welcome, documentSelector, documentUpload, confirm, basePage } = screens
  const copy = basePage.copy(lang)

  describe(`NAVIGATION scenarios in ${lang}`, () => {
    it('should navigate to the second-last step of the flow and then go back to the beginning', async () => {
      goToPassportUploadScreen(driver, screens, `?language=${lang}&async=false&useWebcam=false`)
      uploadFileAndClickConfirmButton(screens, 'passport.jpg')
      documentUpload.getUploadInput()
      documentUpload.upload('face.jpeg')
      basePage.clickBackArrow()
      documentUpload.verifySelfieUploadTitle(copy)
      basePage.clickBackArrow()
      confirm.verifyCheckReadabilityMessage(copy)
      basePage.clickBackArrow()
      documentUpload.verifyPassportTitle(copy)
      basePage.clickBackArrow()
      documentSelector.verifyTitle(copy)
      basePage.clickBackArrow()
      welcome.verifyTitle(copy)
      welcome.checkBackArrowIsNotDisplayed()
    })
  })
}
