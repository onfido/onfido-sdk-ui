import Base from './BasePage.js'
import {locale, verifyElementCopy} from '../utils/mochaw'

class VerificationComplete extends Base{
  get verificationCompleteIcon() { return this.$('.onfido-sdk-ui-Theme-icon')}
  get verificationCompleteMessage() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
  get verificationCompleteThankYou() { return this.$('.onfido-sdk-ui-PageTitle-titleWrapper > div:nth-child(2)')}

  /* eslint-disable no-undef */
  copy(lang) { return locale(lang) }

  verifyVerificationCompleteScreenUIElements() {
    verificationComplete.verificationCompleteIcon.isDisplayed()
    verifyElementCopy(verificationCompleteMessage, documentUploadLocale["complete"]["message"])
    verifyElementCopy(verificationCompleteThankYou, documentUploadLocale["complete"]["submessage"])
  }
}

export default VerificationComplete;
