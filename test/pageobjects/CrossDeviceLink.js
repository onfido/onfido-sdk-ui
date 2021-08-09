import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'

class CrossDeviceLink extends BasePage {
  async alternativeMethodsSectionLabel() {
    return this.$('.onfido-sdk-ui-crossDevice-CrossDeviceLink-styledLabel')
  }
  async switchToSmsOptionBtn() {
    return this.$('.onfido-sdk-ui-crossDevice-CrossDeviceLink-smsLinkOption')
  }
  async switchToCopyLinkOptionBtn() {
    return this.$('.onfido-sdk-ui-crossDevice-CrossDeviceLink-copyLinkOption')
  }
  async switchToQrCodeOptionBtn() {
    return this.$('.onfido-sdk-ui-crossDevice-CrossDeviceLink-qrCodeLinkOption')
  }
  async alternativeMethodOptionsSection() {
    return this.$('.onfido-sdk-ui-crossDevice-CrossDeviceLink-viewOptionsGroup')
  }
  async alternativeMethodOptions() {
    return this.$('.onfido-sdk-ui-crossDevice-CrossDeviceLink-viewOption')
  }
  async isOptionBtnPresent(option) {
    const optionBtnClassMap = {
      copy_link: 'copyLinkOption',
      qr_code: 'qrCodeLinkOption',
      sms: 'smsLinkOption',
    }
    const alternativeMethodOptionsClasses = this.alternativeMethodOptions()
      .getAttribute('class')
      .split(' ')
    return alternativeMethodOptionsClasses.includes(
      `onfido-sdk-ui-crossDevice-CrossDeviceLink-${optionBtnClassMap[option]}`
    )
  }
  async qrCode() {
    return this.$(
      '.onfido-sdk-ui-crossDevice-CrossDeviceLink-qrCodeContainer svg'
    )
  }
  async qrCodeHelpToggleBtn() {
    return this.$('.onfido-sdk-ui-QRCode-qrCodeHelpButton')
  }
  async qrCodeHelpList() {
    return this.$('.onfido-sdk-ui-QRCode-qrCodeHelpList')
  }
  async qrCodeHelpHowToStep1() {
    return this.$('[data-onfido-qa="qrCodeHowToStep1"]')
  }
  async qrCodeHelpHowToStep2() {
    return this.$('[data-onfido-qa="qrCodeHowToStep2"]')
  }
  async numberInputLabel() {
    return this.$(
      '.onfido-sdk-ui-crossDevice-CrossDeviceLink-smsSection > .onfido-sdk-ui-crossDevice-CrossDeviceLink-label'
    )
  }
  async numberInput() {
    return this.$('.onfido-sdk-ui-PhoneNumberInput-mobileInput')
  }
  async sendLinkBtn() {
    return this.$('[data-onfido-qa="cross-device-send-link-btn"]')
  }
  async copyLinkLabel() {
    return this.$(
      '.onfido-sdk-ui-crossDevice-CrossDeviceLink-copyLinkSection > .onfido-sdk-ui-crossDevice-CrossDeviceLink-label'
    )
  }
  async copyToClipboardBtn() {
    return this.$('.onfido-sdk-ui-crossDevice-CrossDeviceLink-copyToClipboard')
  }
  async copyLinkTextContainer() {
    return this.$('.onfido-sdk-ui-crossDevice-CrossDeviceLink-linkText')
  }
  async copyLinkDivider() {
    return this.$('.onfido-sdk-ui-crossDevice-CrossDeviceLink-divider')
  }
  async checkNumberCorrectError() {
    return this.$('.onfido-sdk-ui-crossDevice-CrossDeviceLink-numberError')
  }
  async countrySelect() {
    return this.$('.react-phone-number-input__country-select')
  }

  async verifyTitle(copy) {
    verifyElementCopy(this.title(), copy.get_link.title)
  }

  async verifySubtitleQr(copy) {
    verifyElementCopy(this.subtitle(), copy.get_link.subtitle_qr)
  }

  async verifySubtitleSms(copy) {
    verifyElementCopy(this.subtitle(), copy.get_link.subtitle_sms)
  }

  async verifySubtitleUrl(copy) {
    verifyElementCopy(this.subtitle(), copy.get_link.subtitle_url)
  }

  async verifySwitchToSmsOptionBtn(copy) {
    verifyElementCopy(this.switchToSmsOptionBtn(), copy.get_link.link_sms)
  }

  async verifyAlternativeMethodsSectionLabel(copy) {
    verifyElementCopy(
      this.alternativeMethodsSectionLabel(),
      copy.get_link.link_divider
    )
  }

  async verifySwitchToCopyLinkOptionBtn(copy) {
    verifyElementCopy(this.switchToCopyLinkOptionBtn(), copy.get_link.link_url)
  }

  async verifySwitchToQrCodeOptionBtn(copy) {
    verifyElementCopy(this.switchToQrCodeOptionBtn(), copy.get_link.link_qr)
  }

  async verifyQRCodeHelpToggleBtn(copy) {
    verifyElementCopy(this.qrCodeHelpToggleBtn(), copy.get_link.info_qr_how)
  }

  async verifyQRCodeHelpInstructions(copy) {
    verifyElementCopy(
      this.qrCodeHelpHowToStep1(),
      copy.get_link.info_qr_how_list_item_camera
    )
    verifyElementCopy(
      this.qrCodeHelpHowToStep2(),
      copy.get_link.info_qr_how_list_item_download
    )
  }

  async verifyNumberInputLabel(copy) {
    verifyElementCopy(this.numberInputLabel(), copy.get_link.number_field_label)
  }

  async verifyNumberInput() {
    this.numberInput().isDisplayed()
  }

  async verifySendLinkBtn(copy) {
    verifyElementCopy(this.sendLinkBtn(), copy.get_link.button_submit)
  }

  async verifyCopyLinkLabel(copy) {
    verifyElementCopy(this.copyLinkLabel(), copy.get_link.url_field_label)
  }

  async verifyCopyToClipboardBtnLabel(copy) {
    verifyElementCopy(this.copyToClipboardBtn(), copy.get_link.button_copy)
  }

  async verifyCopyToClipboardBtnChangedState(copy) {
    verifyElementCopy(this.copyToClipboardBtn(), copy.get_link.button_copied)
  }

  async verifyCopyLinkTextContainer() {
    this.copyLinkTextContainer().isDisplayed()
  }

  async verifyCopyLinkDivider() {
    return this.copyLinkDivider().isDisplayed()
  }

  async verifyCheckNumberCorrectError(copy) {
    verifyElementCopy(
      this.checkNumberCorrectError(),
      copy.get_link.alert_wrong_number
    )
  }

  async typeMobileNumber(number) {
    this.numberInput().sendKeys(number)
  }

  async clickOnSendLinkButton() {
    const useSeleniumNativeClick = true
    this.sendLinkBtn().click(useSeleniumNativeClick)
  }

  async selectCountryOption(value) {
    const useSeleniumNativeClick = true
    this.countrySelect().click(useSeleniumNativeClick)
    this.$(
      `.react-phone-number-input__country-select>option[value="${value}"]`
    ).click(useSeleniumNativeClick)
    this.countrySelect().click(useSeleniumNativeClick)
  }

  async switchToCopyLinkOption() {
    this.switchToCopyLinkOptionBtn().click()
  }

  async switchToSendSmsOption() {
    this.switchToSmsOptionBtn().click()
  }

  async toggleQrCodeHelpTextVisibility() {
    this.qrCodeHelpToggleBtn().click()
  }

  async copyToClipboard() {
    this.copyToClipboardBtn().click()
  }
}

export default CrossDeviceLink
