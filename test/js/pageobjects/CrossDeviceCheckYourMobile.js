import Base from './BasePage.js'
import {locale, verifyElementCopy} from '../utils/mochaw'

class CrossDeviceCheckYourMobile extends Base {

  get crossDeviceCheckYourMobileTitle() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
  get crossDeviceCheckYourMobileSubmessage() { return this.$('.onfido-sdk-ui-crossDevice-MobileNotificationSent-submessage')}
  get crossDeviceCheckYourMobileMayTakeFewMinutesMessage() { return this.$('.onfido-sdk-ui-crossDevice-MobileNotificationSent-boldMessage')}
  get crossDeviceCheckYourMobilePhoneIcon() { return this.$('.onfido-sdk-ui-Theme-icon')}
  get crossDeviceCheckYourMobileTipsHeader() { return this.$('.onfido-sdk-ui-Theme-header')}
  get crossDeviceCheckYourMobileTipsFirst() { return this.$('li:nth-child(1)')}
  get crossDeviceCheckYourMobileTipsSecond() { return this.$('li:nth-child(2)')}
  get crossDeviceCheckYourMobileResendLink() { return this.$('.onfido-sdk-ui-crossDevice-MobileNotificationSent-cancel')}

  

  copy(lang) { return locale(lang) }

  async verifyCrossDeviceCheckYourMobileTitle(copy) {
    const crossDeviceCheckYourMobileStrings = copy.cross_device
    verifyElementCopy(this.crossDeviceCheckYourMobileTitle, crossDeviceCheckYourMobileStrings.mobile_notification_sent.title)
  }

  async verifyCrossDeviceCheckYourMobileSubmessage(copy) {
    const crossDeviceCheckYourMobileStrings = copy.cross_device
    verifyElementCopy(this.crossDeviceCheckYourMobileSubmessage, crossDeviceCheckYourMobileStrings.mobile_notification_sent.submessage)
  }

  async verifyMobileNumberMessage(copy) {
    verifyElementCopy(this.crossDeviceCheckYourMobileSubmessage, copy)
  }

  async verifyCrossDeviceCheckYourMobileMayTakeFewMinutesMessage(copy) {
    const crossDeviceCheckYourMobileStrings = copy.cross_device
    verifyElementCopy(this.crossDeviceCheckYourMobileMayTakeFewMinutesMessage, crossDeviceCheckYourMobileStrings.mobile_notification_sent.bold_message)
  }

  async verifycrossDeviceCheckYourMobilePhoneIcon() {
    this.crossDeviceCheckYourMobilePhoneIcon.isDisplayed()
  }

  async verifycrossDeviceCheckYourMobileTipsHeader(copy) {
    const crossDeviceCheckYourMobileStrings = copy.cross_device
    verifyElementCopy(this.crossDeviceCheckYourMobileTipsHeader, crossDeviceCheckYourMobileStrings.tips)
  }

  async verifyCrossDeviceCheckYourMobileTips(copy) {
    const elements = [this.crossDeviceCheckYourMobileTipsFirst, this.crossDeviceCheckYourMobileTipsSecond]
    elements.forEach ((item, index) => {
      const crossDeviceCheckYourMobileStrings = copy.cross_device
      verifyElementCopy(
        item,
        crossDeviceCheckYourMobileStrings.mobile_notification_sent.tips[`item_${index + 1}`])
    })
  }

  async verifyCrossDeviceCheckYourMobileResendLink(copy) {
    const crossDeviceCheckYourMobileStrings = copy.cross_device
    verifyElementCopy(this.crossDeviceCheckYourMobileResendLink, crossDeviceCheckYourMobileStrings.mobile_notification_sent.resend_link)
  }

  async clickResendLink() {
    this.crossDeviceCheckYourMobileResendLink.click()
  }
}

export default CrossDeviceCheckYourMobile;
