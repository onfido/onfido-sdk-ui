import Base from './BasePage.js'

class VerificationComplete extends Base{

  get verificationCompleteIcon() { return this.$('.onfido-sdk-ui-Theme-icon')}
  get verificationCompleteMessage() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
  get verificationCompleteThankYou() { return this.$('.onfido-sdk-ui-Title-titleWrapper > div:nth-child(2)')}
}

export default VerificationComplete;
