import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'
import { asyncForEach } from '../utils/async'

class CrossDeviceMobileConnected extends BasePage {
  async icon() {
    return this.$('.onfido-sdk-ui-Theme-icon')
  }
  async tipsHeader() {
    return this.$('.onfido-sdk-ui-Theme-header')
  }
  async tips() {
    return this.$('.onfido-sdk-ui-Theme-helpList li')
  }
  async cancel() {
    return this.$('.onfido-sdk-ui-crossDevice-MobileConnected-cancel')
  }

  async verifyUIElements(copy) {
    const elements = [await this.tips()]
    await verifyElementCopy(this.title(), copy.switch_phone.title)
    await verifyElementCopy(this.subtitle(), copy.switch_phone.subtitle)
    await this.icon().isDisplayed()
    await verifyElementCopy(this.tipsHeader(), copy.switch_phone.info)
    await asyncForEach(elements, async (item, index) => {
      const copies = [
        copy.switch_phone.info_link_window,
        copy.switch_phone.info_link_expire,
        copy.switch_phone.info_link_refresh,
      ]
      await verifyElementCopy(item, copies[index])
    })
    await verifyElementCopy(this.cancel(), copy.switch_phone.link)
  }
}

export default CrossDeviceMobileConnected
