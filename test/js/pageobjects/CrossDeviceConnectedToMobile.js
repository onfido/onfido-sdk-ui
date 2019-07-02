import Base from './BasePage.js'
import {locale, verifyElementCopy} from '../utils/mochaw'

class CrossDeviceConnectedToMobile extends Base {

  get connectedToYourMobileTitle() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
  get connectedToYourMobileSubtitle() { return this.$('.onfido-sdk-ui-PageTitle-subTitle')}
  get connectedToYourMobileIcon() { return this.$('.onfido-sdk-ui-Theme-icon')}
  get connectedToYourMobileTips() { return this.$('.onfido-sdk-ui-Theme-header')}
  get connectedToYourMobileTipFirst() { return this.$('li:nth-child(1)')}
  get connectedToYourMobileTipSecond() { return this.$('li:nth-child(2)')}
  get connectedToYourMobileTipThird() { return this.$('li:nth-child(3)')}
  get connectedToYourMobileCancel() { return this.$('.onfido-sdk-ui-crossDevice-MobileConnected-cancel')}

  copy(lang) { return locale(lang) }

  async verifyCrossDeviceConnectedToYourMobileUIElements(copy) {
    const connectedToMobileScreenStrings = copy.cross_device
    const connectedToMobileScreenCancelString = copy.cancel
    const elements = [this.connectedToYourMobileTipFirst, this.connectedToYourMobileTipSecond, this.connectedToYourMobileTipThird]

    verifyElementCopy(this.connectedToYourMobileTitle, connectedToMobileScreenStrings.mobile_connected.title.message)
    verifyElementCopy(this.connectedToYourMobileSubtitle, connectedToMobileScreenStrings.mobile_connected.title.submessage)
    this.connectedToYourMobileIcon.isDisplayed()
    verifyElementCopy(this.connectedToYourMobileTips, connectedToMobileScreenStrings.tips)
    elements.forEach ((item, index) => {
      const crossDeviceCheckYourMobileStrings = copy.cross_device
      verifyElementCopy(
        item,
        crossDeviceCheckYourMobileStrings.mobile_connected.tips[`item_${index + 1}`])
    })
    verifyElementCopy(this.connectedToYourMobileCancel, connectedToMobileScreenCancelString)
  }
}

export default CrossDeviceConnectedToMobile;
