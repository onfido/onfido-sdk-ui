import Base from './BasePage.js'
const locale = (lang="en") => require(`../../../src/locales/${lang}.json`)

class VerificationComplete extends Base{
  get verificationCompleteIcon() { return this.$('.onfido-sdk-ui-Theme-icon')}
  get verificationCompleteMessage() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
  get verificationCompleteThankYou() { return this.$('.onfido-sdk-ui-PageTitle-titleWrapper > div:nth-child(2)')}

  copy(lang) { return locale(lang) }
}

export default VerificationComplete;
