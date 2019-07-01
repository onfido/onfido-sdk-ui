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
    const crossDeviceCheckYourMobiletrings = copy.cross_device
    verifyElementCopy(this.crossDeviceCheckYourMobileTitle, crossDeviceCheckYourMobiletrings.mobile_notification_sent.title)
  }

  async verifyCrossDeviceCheckYourMobileSubmessage(copy) {
    const crossDeviceCheckYourMobiletrings = copy.cross_device
    verifyElementCopy(this.crossDeviceCheckYourMobileSubmessage, crossDeviceCheckYourMobiletrings.mobile_notification_sent.submessage)
  }

  async verifyMobileNumberMessage(copy) {
    verifyElementCopy(this.crossDeviceCheckYourMobileSubmessage, copy)
  }

  async verifyCrossDeviceCheckYourMobileMayTakeFewMinutesMessage(copy) {
    const crossDeviceCheckYourMobiletrings = copy.cross_device
    verifyElementCopy(this.crossDeviceCheckYourMobileMayTakeFewMinutesMessage, crossDeviceCheckYourMobiletrings.mobile_notification_sent.bold_message)
  }

  async verifycrossDeviceCheckYourMobilePhoneIcon() {
    this.crossDeviceCheckYourMobilePhoneIcon.isDisplayed()
  }

  async verifycrossDeviceCheckYourMobileTipsHeader(copy) {
    const crossDeviceCheckYourMobiletrings = copy.cross_device
    verifyElementCopy(this.crossDeviceCheckYourMobileTipsHeader, crossDeviceCheckYourMobiletrings.tips)
  }

  async verifyCrossDeviceCheckYourMobileTipsFirst(copy) {
    const crossDeviceCheckYourMobiletrings = copy.cross_device
    verifyElementCopy(this.crossDeviceCheckYourMobileTipsFirst, crossDeviceCheckYourMobiletrings.mobile_notification_sent.tips.item_1)
  }

  async verifyCrossDeviceCheckYourMobileTipsSecond(copy) {
    const crossDeviceCheckYourMobiletrings = copy.cross_device
    verifyElementCopy(this.crossDeviceCheckYourMobileTipsSecond, crossDeviceCheckYourMobiletrings.mobile_notification_sent.tips.item_2)
  }

  async verifyCrossDeviceCheckYourMobileResendLink(copy) {
    const crossDeviceCheckYourMobiletrings = copy.cross_device
    verifyElementCopy(this.crossDeviceCheckYourMobileResendLink, crossDeviceCheckYourMobiletrings.mobile_notification_sent.resend_link)
  }

  async clickResendLink() {
    this.crossDeviceCheckYourMobileResendLink.click()
  }
}

export default CrossDeviceCheckYourMobile;
