import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'

class CrossDeviceClientSuccess extends BasePage {
  async icon() {
    return this.$('.onfido-sdk-ui-Theme-icon')
  }
  async fewSecondsToUpdateMessage() {
    return this.$('.onfido-sdk-ui-crossDevice-ClientSuccess-text')
  }

  async verifyUIElements(copy) {
    const crossDeviceClientSuccessStrings = copy.cross_device.client_success
    verifyElementCopy(this.title(), crossDeviceClientSuccessStrings.title)
    verifyElementCopy(
      this.subtitle(),
      crossDeviceClientSuccessStrings.sub_title
    )
    this.icon().isDisplayed()
    verifyElementCopy(
      this.fewSecondsToUpdateMessage(),
      crossDeviceClientSuccessStrings.body
    )
  }
}

export default CrossDeviceClientSuccess
