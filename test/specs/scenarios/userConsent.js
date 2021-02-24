import { describe, it } from '../../utils/mochaw'
import { localhostUrl } from '../../config.json'

const options = {
  pageObjects: ['BasePage', 'Welcome', 'DocumentSelector', 'UserConsent'],
}

export const userConsentScenarios = async (lang = 'en_US') => {
  describe(
    `USER_CONSENT scenarios in ${lang}`,
    options,
    ({ driver, pageObjects }) => {
      const { basePage, welcome, documentSelector, userConsent } = pageObjects
      const copy = basePage.copy(lang)

      it('should verify UI elements on the consent screen', async () => {
        driver.get(`${localhostUrl}?language=${lang}&showUserConsent=true`)
        welcome.continueToNextStep()
        userConsent.verifyFrameTitle()
        userConsent.verifyAcceptButton(copy)
        userConsent.verifyDeclineButton(copy)
      })

      it('should accept user consent', async () => {
        driver.get(`${localhostUrl}?language=${lang}&showUserConsent=true`)
        welcome.continueToNextStep()
        userConsent.acceptUserConsent()
        documentSelector.verifyTitle(copy)
      })

      it('should decline user consent', async () => {
        driver.get(`${localhostUrl}?language=${lang}&showUserConsent=true`)
        welcome.continueToNextStep()
        userConsent.declineUserConsent()
        welcome.verifyTitle(copy)
      })
    }
  )
}
