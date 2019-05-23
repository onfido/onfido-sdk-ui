import Base from './BasePage.js'
import {locale, verifyElementCopy} from '../utils/mochaw'

class VerificationComplete extends Base{
  get verificationCompleteIcon() { return this.$('.onfido-sdk-ui-Theme-icon')}
  get verificationCompleteMessage() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
  get verificationCompleteThankYou() { return this.$('.onfido-sdk-ui-PageTitle-titleWrapper > div:nth-child(2)')}

  /* eslint-disable no-undef */
  copy(lang) { return locale(lang) }

  verifyVerificationCompleteScreenUIElements() {
    const verificationCompleteScreenStrings = copy(lang).complete
    verificationComplete.verificationCompleteIcon.isDisplayed()
    verifyElementCopy(verificationCompleteMessage, verificationCompleteScreenStrings.message)
    verifyElementCopy(verificationCompleteThankYou, verificationCompleteScreenStrings.submessage)
  }
}

export default VerificationComplete;
