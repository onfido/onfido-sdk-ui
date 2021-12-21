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
    await verifyElementCopy(this.title(), copy.cross_device_return.title)
    await verifyElementCopy(this.subtitle(), copy.cross_device_return.subtitle)
    await this.icon().isDisplayed()
    await verifyElementCopy(
      this.fewSecondsToUpdateMessage(),
      copy.cross_device_return.body
    )
  }
}

export default CrossDeviceClientSuccess
