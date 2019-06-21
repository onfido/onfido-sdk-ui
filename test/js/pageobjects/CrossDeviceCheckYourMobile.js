import Base from './BasePage.js'
import {locale, verifyElementCopy} from '../utils/mochaw'

class CrossDeviceCheckYourMobile extends Base{

  get crossDeviceCheckYourMobileTitle() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
  get crossDeviceCheckYourMobileSubmessage() { return this.$('.onfido-sdk-ui-crossDevice-MobileNotificationSent-submessage')}
  get crossDeviceCheckYourMobileMayTakeFewMinutesMessage() { return this.$('.onfido-sdk-ui-crossDevice-MobileNotificationSent-boldMessage')}

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
}

export default CrossDeviceCheckYourMobile;
