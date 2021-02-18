import { verifyElementCopy } from '../utils/mochaw'
import BasePage from './BasePage.js'

class UserConsent extends BasePage {
  async consentFrameTitle() {
    return this.$('[data-onfido-qa="userConsentFrameWrapper"]> h1')
  }

  async declineBtn() {
    return this.$('[data-onfido-qa="userConsentBtnSecondary"]')
  }
  async acceptBtn() {
    return this.$('[data-onfido-qa="userConsentBtnPrimary"]')
  }

  async verifyFrameTitle() {
    verifyElementCopy(
      this.consentFrameTitle(),
      "Onfido's privacy statement and Terms of Service"
    )
  }

  async verifyAcceptButton(copy) {
    verifyElementCopy(this.acceptBtn(), copy.user_consent.button_primary)
  }

  async verifyDeclineButton(copy) {
    verifyElementCopy(this.declineBtn(), copy.user_consent.button_secondary)
  }

  async acceptUserConsent() {
    this.acceptBtn().click()
  }

  async declineUserConsent() {
    this.declineBtn().click()
  }
}

export default UserConsent
