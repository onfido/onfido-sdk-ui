import Base from './BasePage.js'
import { locale, verifyElementCopy } from '../utils/mochaw'

class VerificationComplete extends Base {
  get icon() { return this.$('.onfido-sdk-ui-Theme-icon')}
  get message() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
  get thankYouMessage() { return this.$('.onfido-sdk-ui-PageTitle-subTitle')}
  get backArrow() { return this.$('.onfido-sdk-ui-NavigationBar-iconBack')}

  copy(lang) { return locale(lang) }

  async verifyUIElements(copy) {
    const verificationCompleteStrings = copy.complete
    this.icon.isDisplayed()
    verifyElementCopy(this.message, verificationCompleteStrings.message)
    verifyElementCopy(this.thankYouMessage, verificationCompleteStrings.submessage)
  }

  async checkBackArrowIsNotDisplayed() {
    try {
      this.backArrow.isDisplayed()
    } catch (e) {
      console.log("Arrow is present:", e)
    }
  }
}

export default VerificationComplete
