import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'
import { asyncForEach } from '../utils/async'

class CrossDeviceMobileNotificationSent extends BasePage {
  async submessage() {
    return this.$(
      '.onfido-sdk-ui-crossDevice-MobileNotificationSent-submessage'
    )
  }
  async itMayTakeFewMinutesMessage() {
    return this.$(
      '.onfido-sdk-ui-crossDevice-MobileNotificationSent-boldMessage'
    )
  }
  async yourMobilePhoneIcon() {
    return this.$('.onfido-sdk-ui-Theme-icon')
  }
  async tipsHeader() {
    return this.$('.onfido-sdk-ui-Theme-header')
  }
  async tips() {
    return this.$('.onfido-sdk-ui-Theme-helpList li')
  }
  async resendLink() {
    return this.$('.onfido-sdk-ui-crossDevice-MobileNotificationSent-cancel')
  }

  async verifyTitle(copy) {
    const mobileNotificationSentStrings = copy.cross_device
    verifyElementCopy(
      this.title(),
      mobileNotificationSentStrings.mobile_notification_sent.title
    )
  }

  async verifySubmessage(copy) {
    verifyElementCopy(this.submessage(), copy)
  }

  async verifyItMayTakeFewMinutesMessage(copy) {
    const mobileNotificationSentStrings = copy.cross_device
    verifyElementCopy(
      this.itMayTakeFewMinutesMessage(),
      mobileNotificationSentStrings.mobile_notification_sent.bold_message
    )
  }

  async verifyCheckYourMobilePhoneIcon() {
    this.yourMobilePhoneIcon().isDisplayed()
  }

  async verifyTipsHeader(copy) {
    const mobileNotificationSentStrings = copy.cross_device
    verifyElementCopy(this.tipsHeader(), mobileNotificationSentStrings.tips)
  }

  async verifyTips(copy) {
    const elements = [this.tips()]
    asyncForEach(elements, async (item, index) => {
      const mobileNotificationSentStrings = copy.cross_device
      // prettier-ignore
      verifyElementCopy(
        item,
        mobileNotificationSentStrings.mobile_notification_sent.tips[`item_${index + 1}`]
      )
    })
  }

  async verifyResendLink(copy) {
    const mobileNotificationSentStrings = copy.cross_device
    verifyElementCopy(
      this.resendLink(),
      mobileNotificationSentStrings.mobile_notification_sent.resend_link
    )
  }

  async clickResendLink() {
    this.resendLink().click()
  }
}

export default CrossDeviceMobileNotificationSent
