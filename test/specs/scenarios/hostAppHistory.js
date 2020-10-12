import { describe, it } from '../../utils/mochaw'
import { uploadFileAndClickConfirmButton } from './sharedFlows.js'
import { localhostUrl } from '../../config.json'

const options = {
  pageObjects: [
    'Welcome',
    'DocumentSelector',
    'DocumentUpload',
    'PassportUploadImageGuide',
    'Confirm',
    'BasePage',
    'DummyHostApp',
  ],
}
export const hostAppHistoryScenarios = async (lang = 'en_US') => {
  // eslint-disable-next-line jest/no-focused-tests
  describe.only(
    `HOST APP HISTORY scenarios in ${lang}`,
    options,
    ({ driver, pageObjects }) => {
      const {
        welcome,
        documentSelector,
        documentUpload,
        passportUploadImageGuide,
        confirm,
        basePage,
        dummyHostApp,
      } = pageObjects
      const copy = basePage.copy(lang)

      it('it should have pre-verification steps when host app has history', async () => {
        driver.get(`${localhostUrl}?useHistory=true&useUploader=true`)
        dummyHostApp.firstStepTextDisplayed()
        dummyHostApp.continueToNextStep()
        dummyHostApp.secondStepTextDisplayed()
        dummyHostApp.startVerificationFlow()
        welcome.continueToNextStep()
      })

      it('it can navigate forward and back when host app has history', async () => {
        driver.get(`${localhostUrl}?useHistory=true&useUploader=true`)
        dummyHostApp.firstStepTextDisplayed()
        dummyHostApp.continueToNextStep()
        dummyHostApp.secondStepTextDisplayed()
        dummyHostApp.startVerificationFlow()
        welcome.continueToNextStep()
        documentSelector.clickOnPassportIcon()
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

      it('by default the SDK back button and the browser back behave consistently', async () => {
        driver.get(`${localhostUrl}?useHistory=true&useUploader=true`)
        dummyHostApp.firstStepTextDisplayed()
        dummyHostApp.continueToNextStep()
        dummyHostApp.secondStepTextDisplayed()
        dummyHostApp.startVerificationFlow()
        welcome.verifyTitle(copy)
        welcome.continueToNextStep()
        documentSelector.verifyTitle(copy)
        documentSelector.clickBackArrow()
        // clicking the SDK back button from the DocumentSelector will take you to the Welcome screen
        welcome.verifyTitle(copy)
        welcome.continueToNextStep()
        documentSelector.verifyTitle(copy)
        // clicking the browser back button from the DocumentSelector will take you to the Welcome screen
        driver.navigate().back()
        welcome.verifyTitle(copy)
      })

      it('when using `useMemoryHistory` the SDK back button and the browser back behave inconsistently', async () => {
        driver.get(
          `${localhostUrl}?useHistory=true&useUploader=true&useMemoryHistory=true`
        )
        dummyHostApp.firstStepTextDisplayed()
        dummyHostApp.continueToNextStep()
        dummyHostApp.secondStepTextDisplayed()
        dummyHostApp.startVerificationFlow()
        welcome.verifyTitle(copy)
        welcome.continueToNextStep()
        documentSelector.verifyTitle(copy)
        documentSelector.clickBackArrow()
        // clicking the SDK back button from the DocumentSelector will take you to the Welcome screen
        welcome.verifyTitle(copy)
        welcome.continueToNextStep()
        documentSelector.verifyTitle(copy)
        // clicking the browser back button from the DocumentSelector will take you to the second step of the dummyHostApp history
        driver.navigate().back()
        dummyHostApp.secondStepTextDisplayed()
      })
    }
  )
}
