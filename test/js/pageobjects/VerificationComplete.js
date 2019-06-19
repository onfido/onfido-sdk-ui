import Base from './BasePage.js'
import {locale, verifyElementCopy} from '../utils/mochaw'

class VerificationComplete extends Base{
  get verificationCompleteIcon() { return this.$('.onfido-sdk-ui-Theme-icon')}
  get verificationCompleteMessage() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
  get verificationCompleteThankYou() { return this.$('.onfido-sdk-ui-PageTitle-titleWrapper > div:nth-child(2)')}

  copy(lang) { return locale(lang) }

  async verifyVerificationCompleteScreenUIElements(copy) {
    const verificationCompleteScreenStrings = copy.complete
    this.verificationCompleteIcon.isDisplayed()
    verifyElementCopy(this.verificationCompleteMessage, verificationCompleteScreenStrings.message)
    verifyElementCopy(this.verificationCompleteThankYou, verificationCompleteScreenStrings.submessage)
  }
}

export default VerificationComplete;
