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
    const elements = [this.tips()]
    verifyElementCopy(this.title(), copy.switch_phone.title)
    verifyElementCopy(this.subtitle(), copy.switch_phone.subtitle)
    this.icon().isDisplayed()
    verifyElementCopy(this.tipsHeader(), copy.switch_phone.info)
    asyncForEach(elements, async (item, index) => {
      const copies = [
        copy.switch_phone.info_link_window,
        copy.switch_phone.info_link_expire,
        copy.switch_phone.info_link_refresh,
      ]
      verifyElementCopy(item, copies[index])
    })
    verifyElementCopy(this.cancel(), copy.switch_phone.info_link_refresh)
  }
}

export default CrossDeviceMobileConnected
