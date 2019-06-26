import Base from './BasePage.js'
import {locale, verifyElementCopy} from '../utils/mochaw'

class CrossDeviceConnectedToMobile extends Base{

  get connectedToYourMobileTitle() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
  get connectedToYourMobileSubtitle() { return this.$('.onfido-sdk-ui-PageTitle-titleWrapper > div:nth-child(2)')}
  get connectedToYourMobileIcon() { return this.$('.onfido-sdk-ui-Theme-icon')}
  get connectedToYourMobileTips() { return this.$('.onfido-sdk-ui-Theme-header')}
  get connectedToYourMobileTip1() { return this.$('li:nth-child(1)')}
  get connectedToYourMobileTip2() { return this.$('li:nth-child(2)')}
  get connectedToYourMobileTip3() { return this.$('li:nth-child(3)')}
  get connectedToYourMobileCancel() { return this.$('.onfido-sdk-ui-crossDevice-MobileConnected-cancel')}

  copy(lang) { return locale(lang) }

  async verifyCrossDeviceConnectedToYourMobileUIElements(copy) {
    const connectedToMobileScreenStrings = copy.cross_device
    const connectedToMobileScreenCancelString = copy.cancel
    verifyElementCopy(this.connectedToYourMobileTitle, connectedToMobileScreenStrings.mobile_connected.title.message)
    verifyElementCopy(this.connectedToYourMobileSubtitle, connectedToMobileScreenStrings.mobile_connected.title.submessage)
    this.connectedToYourMobileIcon.isDisplayed()
    verifyElementCopy(this.connectedToYourMobileTips, connectedToMobileScreenStrings.tips)
    verifyElementCopy(this.connectedToYourMobileTip1, connectedToMobileScreenStrings.mobile_connected.tips.item_1)
    verifyElementCopy(this.connectedToYourMobileTip2, connectedToMobileScreenStrings.mobile_connected.tips.item_2)
    verifyElementCopy(this.connectedToYourMobileTip3, connectedToMobileScreenStrings.mobile_connected.tips.item_3)
    verifyElementCopy(this.connectedToYourMobileCancel, connectedToMobileScreenCancelString)
  }
}

export default CrossDeviceConnectedToMobile;
