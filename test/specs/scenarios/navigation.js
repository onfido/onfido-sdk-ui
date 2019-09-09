import { describe, it } from '../../utils/mochaw'
import { goToPassportUploadScreen, uploadFileAndClickConfirmButton } from './sharedFlows.js'

const options = {
  pageObjects: [
    'Welcome',
    'DocumentSelector',
    'DocumentUpload',
    'Confirm',
    'BasePage'
  ]
}
export const navigationScenarios = async(lang) => {
  describe(`NAVIGATION scenarios in ${lang}`, options, ({driver, pageObjects}) => {

    const { welcome, documentSelector, documentUpload, confirm, basePage } = pageObjects
    const copy = basePage.copy(lang)

    it('should navigate to the second-last step of the flow and then go back to the beginning', async () => {
      goToPassportUploadScreen(driver, welcome, documentSelector, `?language=${lang}&async=false&useWebcam=false`)
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'passport.jpg')
      documentUpload.getUploadInput()
      documentUpload.upload('face.jpeg')
      confirm.clickBackArrow()
      documentUpload.verifySelfieUploadTitle(copy)
      documentUpload.clickBackArrow()
      confirm.verifyCheckReadabilityMessage(copy)
      confirm.clickBackArrow()
      documentUpload.verifyPassportTitle(copy)
      documentUpload.clickBackArrow()
      documentSelector.verifyTitle(copy)
      documentSelector.clickBackArrow()
      welcome.verifyTitle(copy)
      welcome.checkBackArrowIsNotDisplayed()
    })
  })
}
