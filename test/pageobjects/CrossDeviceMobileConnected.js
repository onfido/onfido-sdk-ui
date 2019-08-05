import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'

class CrossDeviceMobileConnected extends BasePage {
  get icon() { return this.$('.onfido-sdk-ui-Theme-icon')}
  get tipsHeader() { return this.$('.onfido-sdk-ui-Theme-header')}
  get tips() { return this.$('.onfido-sdk-ui-crossDevice-MobileConnected-helpList li')}
  get cancel() { return this.$('.onfido-sdk-ui-crossDevice-MobileConnected-cancel')}

  async verifyUIElements(copy) {
    const crossDeviceMobileConnectedStrings = copy.cross_device
    const connectedToMobileScreenCancelString = copy.cancel
    const elements = [this.tips]

    verifyElementCopy(super.title, crossDeviceMobileConnectedStrings.mobile_connected.title.message)
    verifyElementCopy(super.subtitle, crossDeviceMobileConnectedStrings.mobile_connected.title.submessage)
    this.icon.isDisplayed()
    verifyElementCopy(this.tipsHeader, crossDeviceMobileConnectedStrings.tips)
    elements.forEach ((item, index) => {
      const mobileNotificationSentStrings = copy.cross_device
      verifyElementCopy(
        item,
        mobileNotificationSentStrings.mobile_connected.tips[`item_${index + 1}`])
    })
    verifyElementCopy(this.cancel, connectedToMobileScreenCancelString)
  }
}

export default CrossDeviceMobileConnected;
