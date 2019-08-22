import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'
import { By } from 'selenium-webdriver'

class VerificationComplete extends BasePage {
  get icon() { return this.$('.onfido-sdk-ui-Theme-icon')}
  get backArrowSelector() { return By.css('.onfido-sdk-ui-Theme-icon')}
  get backArrow() { return this.$('.onfido-sdk-ui-NavigationBar-iconBack')}

  async verifyUIElements(copy) {
    const verificationCompleteStrings = copy.complete
    this.icon.isDisplayed()
    verifyElementCopy(this.title, verificationCompleteStrings.message)
    verifyElementCopy(this.subtitle, verificationCompleteStrings.submessage)
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
