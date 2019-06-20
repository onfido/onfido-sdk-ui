import Base from './BasePage.js'
import {locale, verifyElementCopy} from '../utils/mochaw'

class CrossDeviceCheckYourMobile extends Base{

  get crossDeviceTitle() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
  
  copy(lang) { return locale(lang) }

  async verifyCrossDeviceCheckYourMobileTitle(copy) {
    const crossDeviceCheckYourMobiletrings = copy.cross_device
    verifyElementCopy(this.crossDeviceTitle, crossDeviceCheckYourMobiletrings.mobile_notification_sent.title)
  }
}

export default CrossDeviceCheckYourMobile;
