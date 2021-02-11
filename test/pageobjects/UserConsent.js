import { verifyElementCopy } from '../utils/mochaw'
import BasePage from './BasePage.js'

class UserConsent extends BasePage {
  async consentFrameTitle() {
    return this.$('.onfido-sdk-ui-UserConsent-consentFrame > h1')
  }

  async declineBtn() {
    return this.$('.onfido-sdk-ui-UserConsent-secondary')
  }
  async acceptBtn() {
    return this.$('.onfido-sdk-ui-Button-button-primary')
  }

  async verifyFrameTitle() {
    verifyElementCopy(
      this.consentFrameTitle(),
      "Accept Onfido's privacy statements and Terms of Service"
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
