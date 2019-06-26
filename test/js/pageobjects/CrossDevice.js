import Base from './BasePage.js'
import {locale, verifyElementCopy} from '../utils/mochaw'

class CrossDevice extends Base{

  get crossDeviceTitle() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
  get crossDeviceSubTitle() { return this.$('.onfido-sdk-ui-Theme-thickWrapper > div:nth-child(1)')}
  get crossDeviceNumberInputLabel() { return this.$('.onfido-sdk-ui-crossDevice-CrossDeviceLink-smsSection > .onfido-sdk-ui-crossDevice-CrossDeviceLink-label')}
  get crossDeviceNumberInput() { return this.$('.rrui__input-field')}
  get crossDeviceSendLinkBtn() { return this.$('.onfido-sdk-ui-Button-button-text')}
  get crossDeviceCopyLinkInstead() { return this.$('.onfido-sdk-ui-crossDevice-CrossDeviceLink-copyLinkSection > .onfido-sdk-ui-crossDevice-CrossDeviceLink-label')}
  get crossDeviceCopyToClipboardBtn() { return this.$('.onfido-sdk-ui-crossDevice-CrossDeviceLink-copyToClipboard')}
  get crossDeviceCopyLinkTextContainer() { return this.$('.onfido-sdk-ui-crossDevice-CrossDeviceLink-linkText')}
  get crossDeviceDivider() { return this.$('.onfido-sdk-ui-crossDevice-CrossDeviceLink-divider')}
  get crossDeviceCheckNumberCorrectError() { return this.$('.onfido-sdk-ui-crossDevice-CrossDeviceLink-numberError')}

  copy(lang) { return locale(lang) }

  async verifyCrossDeviceTitle(copy) {
    const crossDeviceScreentrings = copy.cross_device
    verifyElementCopy(this.crossDeviceTitle, crossDeviceScreentrings.link.title)
  }

  async verifyCrossDeviceSubTitle() {
    this.crossDeviceSubTitle.isDisplayed()
  }

  async verifyCrossDeviceNumberInputLabel(copy) {
    const crossDeviceScreentrings = copy.cross_device
    verifyElementCopy(this.crossDeviceNumberInputLabel, crossDeviceScreentrings.link.sms_label)
  }

  async verifyCrossDeviceNumberInput() {
    this.crossDeviceNumberInput.isDisplayed()
  }

  async verifyCrossDeviceSendLinkBtn(copy) {
    const crossDeviceScreentrings = copy.cross_device
    verifyElementCopy(this.crossDeviceSendLinkBtn, crossDeviceScreentrings.link.button_copy.action)
  }

  async verifyCrossDeviceCopyLinkInstead(copy) {
    const crossDeviceScreentrings = copy.cross_device
    verifyElementCopy(this.crossDeviceCopyLinkInstead, crossDeviceScreentrings.link.copy_link_label)
  }

  async verifyCrossDeviceCopyToClipboardBtn(copy) {
    const crossDeviceScreentrings = copy.cross_device
    verifyElementCopy(this.crossDeviceCopyToClipboardBtn, crossDeviceScreentrings.link.link_copy.action)
  }

  async verifyCrossDeviceCopyToClipboardBtnChangedState(copy) {
    const crossDeviceScreentrings = copy.cross_device
    verifyElementCopy(this.crossDeviceCopyToClipboardBtn, crossDeviceScreentrings.link.link_copy.success)
  }

  async verifyCrossDeviceCopyLinkTextContainer() {
    this.crossDeviceCopyLinkTextContainer.isDisplayed()
  }

  async verifyCrossDeviceDivider() {
    this.crossDeviceDivider.isDisplayed()
  }

  async verifyCrossDeviceCheckNumberCorrectError(copy) {
    const crossDeviceScreentrings = copy.errors
    verifyElementCopy(this.crossDeviceCheckNumberCorrectError, crossDeviceScreentrings.invalid_number.message)
  }

  async typeMobileNumebr(number) {
    this.crossDeviceNumberInput.sendKeys(number)
  }

  async clickOnSendLinkButton() {
    this.crossDeviceSendLinkBtn.click()
  }
}

export default CrossDevice;
