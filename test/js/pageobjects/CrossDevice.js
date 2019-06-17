import Base from './BasePage.js'
import {locale, verifyElementCopy} from '../utils/mochaw'

class CrossDevice extends Base{

  get crossDeviceTitle() { return this.$('.onfido-sdk-ui-Title-titleSpan')}
  get crossDeviceSubTitle() { return this.$('.onfido-sdk-ui-Theme-thickWrapper > div:nth-child(1)')}
  get crossDeviceNumberInputLabel() { return this.$('.onfido-sdk-ui-crossDevice-CrossDeviceLink-smsSection > .onfido-sdk-ui-crossDevice-CrossDeviceLink-label')}
  get crossDeviceNumberInput() { return this.$('.rrui__input-field')}
  get crossDeviceSendLinkBtn() { return this.$('.onfido-sdk-ui-Button-button-text')}
  get crossDeviceCopyLinkInstead() { return this.$('.onfido-sdk-ui-crossDevice-CrossDeviceLink-copyLinkSection > .onfido-sdk-ui-crossDevice-CrossDeviceLink-label')}
  get crossDeviceCopyToClipboardBtn() { return this.$('.onfido-sdk-ui-crossDevice-CrossDeviceLink-copyToClipboard')}
  get crossDeviceCopyLinkTextContainer() { return this.$('.onfido-sdk-ui-crossDevice-CrossDeviceLink-linkText')}
  get crossDeviceDivider() { return this.$('.onfido-sdk-ui-crossDevice-CrossDeviceLink-divider')}

  copy(lang) { return locale(lang) }

  verifyCrossDeviceTitle(copy) {
    const crossDeviceScreentrings = copy.cross_device
    verifyElementCopy(this.crossDeviceIntroTitle, crossDeviceScreentrings.link.title)
  }

  verifyCrossDeviceSubTitle(copy) {
    const crossDeviceScreentrings = copy.cross_device
    verifyElementCopy(this.crossDeviceSubTitle, crossDeviceScreentrings.link.sub_title)
  }

  verifyCrossDeviceNumberInputLabel(copy) {
    const crossDeviceScreentrings = copy.cross_device
    verifyElementCopy(this.crossDeviceSubTitle, crossDeviceScreentrings.link.sub_title)
  }

  verifyCrossDeviceNumberInput() {
    verifyElementCopy(this.crossDeviceNumberInput)
  }

  verifyCrossDeviceSendLinkBtn(copy) {
    const crossDeviceScreentrings = copy.cross_device
    verifyElementCopy(this.crossDeviceSendLinkBtn, crossDeviceScreentrings.link.button_copy.action)
  }

  verifyCrossDeviceCopyLinkInstead(copy) {
    const crossDeviceScreentrings = copy.cross_device
    verifyElementCopy(this.crossDeviceCopyLinkInstead, crossDeviceScreentrings.link.copy_link_label)
  }

  verifyCrossDeviceCopyToClipboardBtn(copy) {
    const crossDeviceScreentrings = copy.cross_device
    verifyElementCopy(this.crossDeviceCopyToClipboardBtn, crossDeviceScreentrings.link.link_copy.action)
  }

  verifyCrossDeviceCopyToClipboardBtnChangedState(copy) {
    const crossDeviceScreentrings = copy.cross_device
    verifyElementCopy(this.crossDeviceCopyToClipboardBtn, crossDeviceScreentrings.link.link_copy.success)
  }

  verifyCrossDeviceCopyLinkTextContainer() {
    verifyElementCopy(this.crossDeviceCopyLinkTextContainer)
  }

  verifyCrossDeviceDivider() {
    verifyElementCopy(this.crossDeviceDivider)
  }
}

export default CrossDevice;
