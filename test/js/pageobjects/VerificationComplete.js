import Base from './BasePage.js'
import {locale} from '../utils/mochaw'

class VerificationComplete extends Base{
  get verificationCompleteIcon() { return this.$('.onfido-sdk-ui-Theme-icon')}
  get verificationCompleteMessage() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
  get verificationCompleteThankYou() { return this.$('.onfido-sdk-ui-PageTitle-titleWrapper > div:nth-child(2)')}

  copy(lang) { return locale(lang) }

  verifyVerificationCompleteScreenUIElements() {
    const verificationCompleteScreenStrings = this.copy(this.lang).complete
    this.verificationComplete.verificationCompleteIcon.isDisplayed()
    this.verifyElementCopy(this.verificationCompleteMessage, verificationCompleteScreenStrings.message)
    this.verifyElementCopy(this.verificationCompleteThankYou, verificationCompleteScreenStrings.submessage)
  }
}

export default VerificationComplete;
