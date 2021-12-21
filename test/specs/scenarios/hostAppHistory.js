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
  describe(
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
        await dummyHostApp.firstStepTextDisplayed()
        dummyHostApp.continueToNextStep()
        await dummyHostApp.secondStepTextDisplayed()
        await dummyHostApp.startVerificationFlow()
        welcome.continueToNextStep()
      })

      it('it can navigate forward and back when host app has history', async () => {
        driver.get(`${localhostUrl}?useHistory=true&useUploader=true`)
        await dummyHostApp.firstStepTextDisplayed()
        dummyHostApp.continueToNextStep()
        await dummyHostApp.secondStepTextDisplayed()
        await dummyHostApp.startVerificationFlow()
        welcome.continueToNextStep()
        await documentSelector.clickOnPassportIcon()
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

      it('by default the SDK back button and the browser back behave consistently', async () => {
        driver.get(`${localhostUrl}?useHistory=true&useUploader=true`)
        await dummyHostApp.firstStepTextDisplayed()
        dummyHostApp.continueToNextStep()
        await dummyHostApp.secondStepTextDisplayed()
        await dummyHostApp.startVerificationFlow()
        welcome.verifyTitle(copy)
        welcome.continueToNextStep()
        documentSelector.verifyTitle(copy)
        await documentSelector.clickBackArrow()
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
        await dummyHostApp.firstStepTextDisplayed()
        dummyHostApp.continueToNextStep()
        await dummyHostApp.secondStepTextDisplayed()
        await dummyHostApp.startVerificationFlow()
        welcome.verifyTitle(copy)
        welcome.continueToNextStep()
        documentSelector.verifyTitle(copy)
        await documentSelector.clickBackArrow()
        // clicking the SDK back button from the DocumentSelector will take you to the Welcome screen
        welcome.verifyTitle(copy)
        welcome.continueToNextStep()
        documentSelector.verifyTitle(copy)
        // clicking the browser back button from the DocumentSelector will take you to the second step of the dummyHostApp history
        driver.navigate().back()
        await dummyHostApp.secondStepTextDisplayed()
      })
    }
  )
}
