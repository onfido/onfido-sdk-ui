import Base from './BasePage.js'
import {locale, verifyElementCopy} from '../utils/mochaw'

class CrossDeviceCheckYourMobile extends Base {

  get title() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
  get submessage() { return this.$('.onfido-sdk-ui-crossDevice-MobileNotificationSent-submessage')}
  get mayTakeFewMinutesMessage() { return this.$('.onfido-sdk-ui-crossDevice-MobileNotificationSent-boldMessage')}
  get yourMobilePhoneIcon() { return this.$('.onfido-sdk-ui-Theme-icon')}
  get tipsHeader() { return this.$('.onfido-sdk-ui-Theme-header')}
  get firstTip() { return this.$('li:nth-child(1)')}
  get secondTip() { return this.$('li:nth-child(2)')}
  get resendLink() { return this.$('.onfido-sdk-ui-crossDevice-MobileNotificationSent-cancel')}

  copy(lang) { return locale(lang) }

  async verifyTitle(copy) {
    const crossDeviceCheckYourMobileStrings = copy.cross_device
    verifyElementCopy(this.title, crossDeviceCheckYourMobileStrings.mobile_notification_sent.title)
  }

  async verifySubmessage(copy) {
    verifyElementCopy(this.submessage, copy)
  }

  async verifyMayTakeFewMinutesMessage(copy) {
    const crossDeviceCheckYourMobileStrings = copy.cross_device
    verifyElementCopy(this.mayTakeFewMinutesMessage, crossDeviceCheckYourMobileStrings.mobile_notification_sent.bold_message)
  }

  async verifycrossDeviceCheckYourMobilePhoneIcon() {
    this.yourMobilePhoneIcon.isDisplayed()
  }

  async verifyTipsHeader(copy) {
    const crossDeviceCheckYourMobileStrings = copy.cross_device
    verifyElementCopy(this.tipsHeader, crossDeviceCheckYourMobileStrings.tips)
  }

  async verifyTips(copy) {
    const elements = [this.firstTip, this.secondTip]
    elements.forEach ((item, index) => {
      const crossDeviceCheckYourMobileStrings = copy.cross_device
      verifyElementCopy(
        item,
        crossDeviceCheckYourMobileStrings.mobile_notification_sent.tips[`item_${index + 1}`])
    })
  }

  async verifyResendLink(copy) {
    const crossDeviceCheckYourMobileStrings = copy.cross_device
    verifyElementCopy(this.resendLink, crossDeviceCheckYourMobileStrings.mobile_notification_sent.resend_link)
  }

  async clickResendLink() {
    this.resendLink.click()
  }
}

export default CrossDeviceCheckYourMobile;
