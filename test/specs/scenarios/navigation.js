import { describe, it } from '../../utils/mochaw'
import { localhostUrl } from '../../utils/config'

export const navigationScenarios = (driver, screens, lang) => {
  const { welcome, documentSelector, documentUpload, documentUploadConfirmation, common } = screens
  const copy = common.copy(lang)
  
  describe(`NAVIGATION scenarios in ${lang}`, () => {
    const goToPassportUploadScreen = async (parameter='') => {
      driver.get(localhostUrl + parameter)
      welcome.primaryBtn.click()
      documentSelector.passportIcon.click()
    }

    const uploadFileAndClickConfirmButton = async (fileName) => {
      documentUpload.getUploadInput()
      documentUpload.upload(fileName)
      documentUploadConfirmation.confirmBtn.click()
    }

    it('should navigate to the second-last step of the flow and then go back to the beginning', async () => {
      goToPassportUploadScreen(`?language=${lang}&async=false&useWebcam=false`)
      uploadFileAndClickConfirmButton('passport.jpg')
      documentUpload.getUploadInput()
      documentUpload.upload('face.jpeg')
      common.clickBackArrow()
      documentUpload.verifySelfieUploadTitle(copy)
      common.clickBackArrow()
      documentUploadConfirmation.verifyCheckReadabilityMessage(copy)
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
