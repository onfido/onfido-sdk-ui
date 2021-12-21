import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'

class VerificationComplete extends BasePage {
  async icon() {
    return this.$('.onfido-sdk-ui-Theme-icon')
  }
  async backArrow() {
    return this.$('.onfido-sdk-ui-NavigationBar-iconBack')
  }

  async verifyUIElements(copy) {
    await this.icon().isDisplayed()
    await verifyElementCopy(this.title(), copy.outro.title)
    await verifyElementCopy(this.subtitle(), copy.outro.body)
  }

  async checkBackArrowIsNotDisplayed() {
    try {
      await this.backArrow().isDisplayed()
    } catch (e) {
      console.log('Arrow is present:', e)
      return false
    }
  }
}

export default VerificationComplete
