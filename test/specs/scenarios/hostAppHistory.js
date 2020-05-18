import { describe, it } from '../../utils/mochaw'
import { uploadFileAndClickConfirmButton } from './sharedFlows.js'
import { localhostUrl } from '../../config.json'

const options = {
  pageObjects: [
    'Welcome',
    'DocumentSelector',
    'DocumentUpload',
    'Confirm',
    'BasePage',
    'DummyHostApp'
  ]
}
export const hostAppHistoryScenarios = async(lang='en_US') => {
  describe(`HOST APP HISTORY scenarios in ${lang}`, options, ({driver, pageObjects}) => {

    const {
      welcome,
      documentSelector,
      documentUpload,
      confirm,
      basePage,
      dummyHostApp
    } = pageObjects
    const copy = basePage.copy(lang)

    it('it should have pre-verification steps when host app has history', async () => {
      driver.get(`${localhostUrl}?useHistory=true&async=false&useUploader=true`)
      dummyHostApp.firstStepTextDisplayed()
      dummyHostApp.continueToNextStep()
      dummyHostApp.secondStepTextDisplayed()
      dummyHostApp.startVerificationFlow()
      welcome.continueToNextStep()
    })

    it('it can navigate forward and back when host app has history', async () => {
      driver.get(`${localhostUrl}?useHistory=true&async=false&useUploader=true`)
      dummyHostApp.firstStepTextDisplayed()
      dummyHostApp.continueToNextStep()
      dummyHostApp.secondStepTextDisplayed()
      dummyHostApp.startVerificationFlow()
      welcome.continueToNextStep()
      documentSelector.clickOnPassportIcon()
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
      driver.navigate().back()
      dummyHostApp.secondStepTextDisplayed()
      driver.navigate().back()
      dummyHostApp.firstStepTextDisplayed()
    })
  })
}