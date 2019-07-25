import {verifyElementCopy} from '../utils/mochaw'
import Screen from './Screen.js'

class CrossDeviceLink extends Screen {

  get title() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
  get subtitle() { return this.$('.onfido-sdk-ui-crossDevice-CrossDeviceLink-subTitle')}
  get numberInputLabel() { return this.$('.onfido-sdk-ui-crossDevice-CrossDeviceLink-smsSection > .onfido-sdk-ui-crossDevice-CrossDeviceLink-label')}
  get numberInput() { return this.$('.rrui__input-field')}
  get sendLinkBtn() { return this.$('.onfido-sdk-ui-Button-button-text')}
  get copyLinkInsteadLabel() { return this.$('.onfido-sdk-ui-crossDevice-CrossDeviceLink-copyLinkSection > .onfido-sdk-ui-crossDevice-CrossDeviceLink-label')}
  get copyToClipboardBtn() { return this.$('.onfido-sdk-ui-crossDevice-CrossDeviceLink-copyToClipboard')}
  get copyLinkTextContainer() { return this.$('.onfido-sdk-ui-crossDevice-CrossDeviceLink-linkText')}
  get divider() { return this.$('.onfido-sdk-ui-crossDevice-CrossDeviceLink-divider')}
  get checkNumberCorrectError() { return this.$('.onfido-sdk-ui-crossDevice-CrossDeviceLink-numberError')}

  async verifyTitle(copy) {
    const crossDeviceLinkStrings = copy.cross_device
    verifyElementCopy(this.title, crossDeviceLinkStrings.link.title)
  }

  async verifySubtitle() {
    this.subtitle.isDisplayed()
  }

  async verifyNumberInputLabel(copy) {
    const crossDeviceLinkStrings = copy.cross_device
    verifyElementCopy(this.numberInputLabel, crossDeviceLinkStrings.link.sms_label)
  }

  async verifyNumberInput() {
    this.numberInput.isDisplayed()
  }

  async verifySendLinkBtn(copy) {
    const crossDeviceLinkStrings = copy.cross_device
    verifyElementCopy(this.sendLinkBtn, crossDeviceLinkStrings.link.button_copy.action)
  }

  async verifyCopyLinkInsteadLabel(copy) {
    const crossDeviceLinkStrings = copy.cross_device
    verifyElementCopy(this.copyLinkInsteadLabel, crossDeviceLinkStrings.link.copy_link_label)
  }

  async verifyCopyToClipboardBtn(copy) {
    const crossDeviceLinkStrings = copy.cross_device
    verifyElementCopy(this.copyToClipboardBtn, crossDeviceLinkStrings.link.link_copy.action)
  }

  async verifyCopyToClipboardBtnChangedState(copy) {
    const crossDeviceLinkStrings = copy.cross_device
    verifyElementCopy(this.copyToClipboardBtn, crossDeviceLinkStrings.link.link_copy.success)
  }

  async verifyCopyLinkTextContainer() {
    this.copyLinkTextContainer.isDisplayed()
  }

  async verifyDivider() {
    this.divider.isDisplayed()
  }

  async verifyCheckNumberCorrectError(copy) {
    const crossDeviceLinkStrings = copy.errors
    verifyElementCopy(this.checkNumberCorrectError, crossDeviceLinkStrings.invalid_number.message)
  }

  async typeMobileNumber(number) {
    this.numberInput.sendKeys(number)
  }

  async clickOnSendLinkButton() {
    this.sendLinkBtn.click()
  }
}

export default CrossDeviceLink;
