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
    await verifyElementCopy(this.title(), copy.sms_sent.title)
  }

  async verifySubmessage(copy) {
    await verifyElementCopy(this.submessage(), copy)
  }

  async verifyItMayTakeFewMinutesMessage(copy) {
    await verifyElementCopy(
      this.itMayTakeFewMinutesMessage(),
      copy.sms_sent.subtitle_minutes
    )
  }

  async verifyCheckYourMobilePhoneIcon() {
    await this.yourMobilePhoneIcon().isDisplayed()
  }

  async verifyTipsHeader(copy) {
    await verifyElementCopy(this.tipsHeader(), copy.sms_sent.info)
  }

  async verifyTips(copy) {
    const elements = [await this.tips()]
    const copies = [
      copy.sms_sent.info_link_window,
      copy.sms_sent.info_link_expire,
    ]

    await asyncForEach(elements, async (item, index) => {
      await verifyElementCopy(item, copies[index])
    })
  }

  async verifyResendLink(copy) {
    await verifyElementCopy(this.resendLink(), copy.sms_sent.link)
  }

  async clickResendLink() {
    this.resendLink().click()
  }
}

export default CrossDeviceMobileNotificationSent
