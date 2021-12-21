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

      beforeEach(async () => {
        driver.get(`${localhostUrl}?language=${lang}&showUserConsent=true`)
        welcome.continueToNextStep()
      })

      it('should verify UI elements on the consent screen', async () => {
        await userConsent.verifyFrameTitle()
        await userConsent.verifyAcceptButton(copy)
        await userConsent.verifyDeclineButton(copy)
      })

      it('should accept user consent', async () => {
        await userConsent.acceptUserConsent()
        documentSelector.verifyTitle(copy)
      })

      it('when clicking on decline it should show a modal', async () => {
        await userConsent.declineUserConsent()
        await userConsent.userConsentModalIsOpen()
        await userConsent.verifyUserConsentDeclineModalTitle(copy)
        await userConsent.verifyUserConsentDeclineModalPrimaryBtn(copy)
        await userConsent.verifyUserConsentDeclineModalSecondaryBtn(copy)
      })

      it('when clicking on the modal primary button the modal should be dismissed', async () => {
        await userConsent.declineUserConsent()
        await userConsent.userConsentModalIsOpen()
        await userConsent.verifyUserConsentDeclineModalTitle(copy)
        await userConsent.userConsentDeclineModalPrimaryBtnClick()
        driver.sleep(500)
        await userConsent.userConsentModalIsClosed()
      })

      it('when clicking on the secondary button the sdk should be unmounted', async () => {
        await userConsent.declineUserConsent()
        await userConsent.userConsentModalIsOpen()
        await userConsent.verifyUserConsentDeclineModalTitle(copy)
        await userConsent.userConsentDeclineModalSecondaryBtnClick()
        await userConsent.isConsentScreenUnmounted()
      })
    }
  )
}
