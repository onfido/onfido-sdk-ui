import { describe, it } from '../../utils/mochaw'
import {goToPassportUploadScreen, uploadFileAndClickConfirmButton} from './sharedFlows.js'

export const navigationScenarios = (driver, screens, lang) => {
  const { welcome, documentSelector, documentUpload, confirm, common } = screens
  const copy = common.copy(lang)

  describe(`NAVIGATION scenarios in ${lang}`, () => {
    it('should navigate to the second-last step of the flow and then go back to the beginning', async () => {
      goToPassportUploadScreen(driver, screens, `?language=${lang}&async=false&useWebcam=false`)
      uploadFileAndClickConfirmButton(screens, 'passport.jpg')
      documentUpload.getUploadInput()
      documentUpload.upload('face.jpeg')
      common.clickBackArrow()
      documentUpload.verifySelfieUploadTitle(copy)
      common.clickBackArrow()
      confirm.verifyCheckReadabilityMessage(copy)
      common.clickBackArrow()
      documentUpload.verifyPassportTitle(copy)
      common.clickBackArrow()
      documentSelector.verifyTitle(copy)
      common.clickBackArrow()
      welcome.verifyTitle(copy)
      welcome.checkBackArrowIsNotDisplayed()
    })
  })
}
