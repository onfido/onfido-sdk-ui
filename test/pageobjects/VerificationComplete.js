import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'

class VerificationComplete extends BasePage {
  get icon() { return this.$('.onfido-sdk-ui-Theme-icon')}
  get backArrow() { return this.$('.onfido-sdk-ui-NavigationBar-iconBack')}

  async verifyUIElements(copy) {
    const verificationCompleteStrings = copy.complete
    this.icon.isDisplayed()
    verifyElementCopy(super.title, verificationCompleteStrings.message)
    verifyElementCopy(super.subtitle, verificationCompleteStrings.submessage)
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
