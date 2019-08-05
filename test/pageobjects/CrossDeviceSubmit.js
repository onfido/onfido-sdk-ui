import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'

class CrossDeviceSubmit extends BasePage {
  get documentUploadedMessage() { return this.$('li:nth-child(1) > .onfido-sdk-ui-crossDevice-CrossDeviceSubmit-listText')}
  get videoUploadedMessage() { return this.$('li:nth-child(2) > .onfido-sdk-ui-crossDevice-CrossDeviceSubmit-listText')}
  get submitVerificationButton() { return this.$('.onfido-sdk-ui-Button-button-text')}

  async verifyUIElements(copy) {
    const crossDeviceSubmitStrings = copy.cross_device.submit
    verifyElementCopy(super.title, crossDeviceSubmitStrings.title)
    verifyElementCopy(super.subtitle, crossDeviceSubmitStrings.sub_title)
    verifyElementCopy(this.documentUploadedMessage, crossDeviceSubmitStrings.one_doc_uploaded)
    verifyElementCopy(this.videoUploadedMessage, crossDeviceSubmitStrings.video_uploaded)
    verifyElementCopy(this.submitVerificationButton, crossDeviceSubmitStrings.action)
  }

  async clickOnSubmitVerificationButton() {
    this.submitVerificationButton.click()
  }
}

export default CrossDeviceSubmit;
