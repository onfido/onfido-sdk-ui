import Base from './BasePage.js'
import {locale, verifyElementCopy} from '../utils/mochaw'

class CrossDeviceConnectedToMobile extends Base {

  get title() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
  get subtitle() { return this.$('.onfido-sdk-ui-PageTitle-subTitle')}
  get icon() { return this.$('.onfido-sdk-ui-Theme-icon')}
  get tipsHeader() { return this.$('.onfido-sdk-ui-Theme-header')}
  get firstTip() { return this.$('li:nth-child(1)')}
  get secondTip() { return this.$('li:nth-child(2)')}
  get thirdTip() { return this.$('li:nth-child(3)')}
  get cancel() { return this.$('.onfido-sdk-ui-crossDevice-MobileConnected-cancel')}

  copy(lang) { return locale(lang) }

  async verifyUIElements(copy) {
    const connectedToMobileScreenStrings = copy.cross_device
    const connectedToMobileScreenCancelString = copy.cancel
    const elements = [this.firstTip, this.secondTip, this.thirdTip]

    verifyElementCopy(this.title, connectedToMobileScreenStrings.mobile_connected.title.message)
    verifyElementCopy(this.subtitle, connectedToMobileScreenStrings.mobile_connected.title.submessage)
    this.icon.isDisplayed()
    verifyElementCopy(this.tipsHeader, connectedToMobileScreenStrings.tips)
    elements.forEach ((item, index) => {
      const crossDeviceCheckYourMobileStrings = copy.cross_device
      verifyElementCopy(
        item,
        crossDeviceCheckYourMobileStrings.mobile_connected.tips[`item_${index + 1}`])
    })
    verifyElementCopy(this.cancel, connectedToMobileScreenCancelString)
  }
}

export default CrossDeviceConnectedToMobile;
