import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'

class CrossDeviceLink extends BasePage {
  async switchToSmsOptionBtn() { return this.$('.onfido-sdk-ui-crossDevice-CrossDeviceLink-smsLinkOption') }
  async switchToCopyLinkOptionBtn() { return this.$('.onfido-sdk-ui-crossDevice-CrossDeviceLink-copyLinkOption') }
  async switchToQrCodeOptionBtn() { return this.$('.onfido-sdk-ui-crossDevice-CrossDeviceLink-qrCodeLinkOption') }
  async qrCode() { return this.$('.onfido-sdk-ui-crossDevice-CrossDeviceLink-qrCodeContainer svg') }
  async qrCodeHelpToggleBtn() { return this.$('.onfido-sdk-ui-QRCode-qrCodeHelpButton') }
  async qrCodeHelpList() { return this.$('.onfido-sdk-ui-QRCode-qrCodeHelpList') }
  async qrCodeHelpHowToStep1() { return this.$('[data-onfido-qa="qrCodeHowToStep1"]') }
  async qrCodeHelpHowToStep2() { return this.$('[data-onfido-qa="qrCodeHowToStep2"]') }
  async numberInputLabel() { return this.$('.onfido-sdk-ui-crossDevice-CrossDeviceLink-smsSection > .onfido-sdk-ui-crossDevice-CrossDeviceLink-label')}
  async numberInput() { return this.$('.onfido-sdk-ui-PhoneNumberInput-mobileInput')}
  async sendLinkBtn() { return this.$('.onfido-sdk-ui-Button-button-text')}
  async copyLinkInsteadLabel() { return this.$('.onfido-sdk-ui-crossDevice-CrossDeviceLink-copyLinkSection > .onfido-sdk-ui-crossDevice-CrossDeviceLink-label')}
  async copyToClipboardBtn() { return this.$('.onfido-sdk-ui-crossDevice-CrossDeviceLink-copyToClipboard')}
  async copyLinkTextContainer() { return this.$('.onfido-sdk-ui-crossDevice-CrossDeviceLink-linkText')}
  async divider() { return this.$('.onfido-sdk-ui-crossDevice-CrossDeviceLink-divider')}
  async checkNumberCorrectError() { return this.$('.onfido-sdk-ui-crossDevice-CrossDeviceLink-numberError')}
  async countrySelect() { return this.$('.react-phone-number-input__country-select') }

  async verifyTitle(copy) {
    const crossDeviceLinkStrings = copy.cross_device
    verifyElementCopy(this.title(), crossDeviceLinkStrings.link.title)
  }

  async verifySubtitle(expectedSubtitleCopy) {
    verifyElementCopy(this.subtitle(), expectedSubtitleCopy)
  }

  async verifySwitchToSmsOptionBtn(expectedSwitchToSmsOptionBtnCopy) {
    verifyElementCopy(this.switchToSmsOptionBtn(), expectedSwitchToSmsOptionBtnCopy)
  }

  async verifySwitchToCopyLinkOptionBtn(expectedSwitchToCopyLinkOptionBtnCopy) {
    verifyElementCopy(this.switchToCopyLinkOptionBtn(), expectedSwitchToCopyLinkOptionBtnCopy)
  }

  async verifySwitchToQrCodeOptionBtn(expectedSwitchToQrCodeOptionBtnCopy) {
    verifyElementCopy(this.switchToQrCodeOptionBtn(), expectedSwitchToQrCodeOptionBtnCopy)
  }

  async verifyQRCodeHelpToggleBtn(expectedQRCodeHelpToggleBtnCopy) {
    verifyElementCopy(this.qrCodeHelpToggleBtn(), expectedQRCodeHelpToggleBtnCopy)
  }

  async verifyQRCodeHelpInstructions(crossDeviceLinkQRCodeHowToStrings) {
    verifyElementCopy(this.qrCodeHelpHowToStep1(), crossDeviceLinkQRCodeHowToStrings.help_step_1)
    verifyElementCopy(this.qrCodeHelpHowToStep2(), crossDeviceLinkQRCodeHowToStrings.help_step_2)
  }

  async verifyNumberInputLabel(copy) {
    const crossDeviceLinkStrings = copy.cross_device
    verifyElementCopy(this.numberInputLabel(), crossDeviceLinkStrings.link.sms_label)
  }

  async verifyNumberInput() {
    this.numberInput().isDisplayed()
  }

  async verifySendLinkBtn(copy) {
    const crossDeviceLinkStrings = copy.cross_device
    verifyElementCopy(this.sendLinkBtn(), crossDeviceLinkStrings.link.button_copy.action)
  }

  async verifyCopyLinkInsteadLabel(copy) {
    const crossDeviceLinkStrings = copy.cross_device
    verifyElementCopy(this.copyLinkInsteadLabel(), crossDeviceLinkStrings.link.copy_link_label)
  }

  async verifyCopyToClipboardBtn(copy) {
    const crossDeviceLinkStrings = copy.cross_device
    verifyElementCopy(this.copyToClipboardBtn(), crossDeviceLinkStrings.link.copy_link.action)
  }

  async verifyCopyToClipboardBtnChangedState(copy) {
    const crossDeviceLinkStrings = copy.cross_device
    verifyElementCopy(this.copyToClipboardBtn(), crossDeviceLinkStrings.link.copy_link.success)
  }

  async verifyCopyLinkTextContainer() {
    this.copyLinkTextContainer().isDisplayed()
  }

  async verifyDivider() {
    this.divider().isDisplayed()
  }

  async verifyCheckNumberCorrectError(copy) {
    const crossDeviceLinkStrings = copy.errors
    verifyElementCopy(this.checkNumberCorrectError(), crossDeviceLinkStrings.invalid_number.message)
  }

  async typeMobileNumber(number) {
    this.numberInput().sendKeys(number)
  }

  async clickOnSendLinkButton() {
    this.clickWhenClickable(this.sendLinkBtn())
  }

  async selectCountryOption(value) {
    this.countrySelect().click()
    this.$(`.react-phone-number-input__country-select option[value="${value}"]`).click()
    this.countrySelect().click()
  }
}

export default CrossDeviceLink;
