import Base from './BasePage.js'
const locale = (lang="en") => require(`../../../src/locales/${lang}.json`)

class VerificationComplete extends Base{
  get verificationCompleteIcon() { return this.$('.onfido-sdk-ui-Theme-icon')}
  get verificationCompleteMessage() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
  get verificationCompleteThankYou() { return this.$('.onfido-sdk-ui-PageTitle-titleWrapper > div:nth-child(2)')}

  /* eslint-disable no-undef */
  copy(lang) { return locale(lang) }

  verifyVerificationCompleteScreenUIElements() {
    verificationComplete.verificationCompleteIcon.isDisplayed()
    const verificationCompleteMessage = verificationCompleteMessage.getText()
    expect(verificationCompleteMessage).to.equal(documentUploadLocale["complete"]["message"])
    verificationCompleteMessage.isDisplayed()
    const verificationCompleteThankYou = verificationCompleteThankYou.getText()
    expect(verificationCompleteThankYou).to.equal(documentUploadLocale["complete"]["submessage"])
    verificationCompleteThankYou.isDisplayed()
  }
}

export default VerificationComplete;
