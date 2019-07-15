import Base from './BasePage.js'
import {locale, verifyElementCopy} from '../utils/mochaw'

class CrossDeviceSubmit extends Base {

  get title() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
  get subtitle() { return this.$('.onfido-sdk-ui-PageTitle-subTitle')}
  get documentUploadedMessage() { return this.$('li:nth-child(1) > .onfido-sdk-ui-crossDevice-CrossDeviceSubmit-listText')}
  get videoUploadedMessage() { return this.$('li:nth-child(2) > .onfido-sdk-ui-crossDevice-CrossDeviceSubmit-listText')}
  get submitVerificationButton() { return this.$('.onfido-sdk-ui-Button-button-text')}

  copy(lang) { return locale(lang) }

  async verifyUIElements(copy) {
    const crossDeviceSubmitStrings = copy.cross_device.submit
    verifyElementCopy(this.title, crossDeviceSubmitStrings.title)
    verifyElementCopy(this.subtitle, crossDeviceSubmitStrings.sub_title)
    verifyElementCopy(this.documentUploadedMessage, crossDeviceSubmitStrings.one_doc_uploaded)
    verifyElementCopy(this.videoUploadedMessage, crossDeviceSubmitStrings.video_uploaded)
    verifyElementCopy(this.submitVerificationButton, crossDeviceSubmitStrings.action)
  }

  async clickOnSubmitVerificationButton() {
    this.submitVerificationButton.click()
  }
}

export default CrossDeviceSubmit;
