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
    verifyElementCopy(this.title(), copy.cross_device_return.title)
    verifyElementCopy(this.subtitle(), copy.cross_device_return.subtitle)
    this.icon().isDisplayed()
    verifyElementCopy(
      this.fewSecondsToUpdateMessage(),
      copy.cross_device_return.body
    )
  }
}

export default CrossDeviceClientSuccess
