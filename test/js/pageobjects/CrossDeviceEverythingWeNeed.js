import Base from './BasePage.js'
import {locale, verifyElementCopy} from '../utils/mochaw'

class CrossDeviceEverythingWeNeed extends Base{

  get crossDeviceEverythingWeNeedTitle() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
  get crossDeviceEverythingWeNeedSubTitle() { return this.$('.onfido-sdk-ui-PageTitle-titleWrapper > div:nth-child(2)')}
  get crossDeviceEverythingWeNeedDocumentUploadedMessage() { return this.$('li:nth-child(1) > .onfido-sdk-ui-crossDevice-CrossDeviceSubmit-listText')}
  get crossDeviceEverythingWeNeedVideoUploadedMessage() { return this.$('li:nth-child(2) > .onfido-sdk-ui-crossDevice-CrossDeviceSubmit-listText')}
  get crossDeviceEverythingWeNeedSubmitVerificationButton() { return this.$('.onfido-sdk-ui-Button-button-text')}

  copy(lang) { return locale(lang) }

  async verifyCrossDeviceEverythingWeNeedUIElements(copy) {
    const crossDeviceEverythingWeNeedtrings = copy.cross_device.submit
    verifyElementCopy(this.crossDeviceEverythingWeNeedTitle, crossDeviceEverythingWeNeedtrings.title)
    verifyElementCopy(this.crossDeviceEverythingWeNeedSubTitle, crossDeviceEverythingWeNeedtrings.sub_title)
    verifyElementCopy(this.crossDeviceEverythingWeNeedDocumentUploadedMessage, crossDeviceEverythingWeNeedtrings.one_doc_uploaded)
    verifyElementCopy(this.crossDeviceEverythingWeNeedVideoUploadedMessage, crossDeviceEverythingWeNeedtrings.video_uploaded)
    verifyElementCopy(this.crossDeviceEverythingWeNeedSubmitVerificationButton, crossDeviceEverythingWeNeedtrings.action)
  }

  async clickOnSubmitVerificationButton() {
    this.crossDeviceEverythingWeNeedSubmitVerificationButton.click()
  }
}

export default CrossDeviceEverythingWeNeed;
