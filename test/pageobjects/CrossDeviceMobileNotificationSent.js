import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'

class CrossDeviceMobileNotificationSent extends BasePage {
  get submessage() { return this.$('.onfido-sdk-ui-crossDevice-MobileNotificationSent-submessage')}
  get mayTakeFewMinutesMessage() { return this.$('.onfido-sdk-ui-crossDevice-MobileNotificationSent-boldMessage')}
  get yourMobilePhoneIcon() { return this.$('.onfido-sdk-ui-Theme-icon')}
  get tipsHeader() { return this.$('.onfido-sdk-ui-Theme-header')}
  get tips() { return this.$('.onfido-sdk-ui-crossDevice-MobileNotificationSent-helpList li')}
  get resendLink() { return this.$('.onfido-sdk-ui-crossDevice-MobileNotificationSent-cancel')}

  async verifyTitle(copy) {
    const mobileNotificationSentStrings = copy.cross_device
    verifyElementCopy(this.title, mobileNotificationSentStrings.mobile_notification_sent.title)
  }

  async verifySubmessage(copy) {
    verifyElementCopy(this.submessage, copy)
  }

  async verifyMayTakeFewMinutesMessage(copy) {
    const mobileNotificationSentStrings = copy.cross_device
    verifyElementCopy(this.mayTakeFewMinutesMessage, mobileNotificationSentStrings.mobile_notification_sent.bold_message)
  }

  async verifycrossDeviceCheckYourMobilePhoneIcon() {
    this.yourMobilePhoneIcon.isDisplayed()
  }

  async verifyTipsHeader(copy) {
    const mobileNotificationSentStrings = copy.cross_device
    verifyElementCopy(this.tipsHeader, mobileNotificationSentStrings.tips)
  }

  async verifyTips(copy) {
    const elements = [this.tips]
    elements.forEach ((item, index) => {
      const mobileNotificationSentStrings = copy.cross_device
      verifyElementCopy(
        item,
        mobileNotificationSentStrings.mobile_notification_sent.tips[`item_${index + 1}`])
    })
  }

  async verifyResendLink(copy) {
    const mobileNotificationSentStrings = copy.cross_device
    verifyElementCopy(this.resendLink, mobileNotificationSentStrings.mobile_notification_sent.resend_link)
  }

  async clickResendLink() {
    this.resendLink.click()
  }
}

export default CrossDeviceMobileNotificationSent;
