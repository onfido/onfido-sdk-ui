import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'
import { asyncForEach } from '../utils/async'

class CrossDeviceClientIntro extends BasePage {
  async icon() {
    return this.$('.onfido-sdk-ui-crossDevice-ClientIntro-icon')
  }

  async customIcon() {
    return this.$('.onfido-sdk-ui-crossDevice-ClientIntro-customIcon')
  }

  async infoHeader() {
    return this.$('.onfido-sdk-ui-crossDevice-ClientIntro-header')
  }
  async infoList() {
    return this.$(
      '.onfido-sdk-ui-crossDevice-ClientIntro-help .onfido-sdk-ui-Theme-helpList li'
    )
  }

  async continueButton() {
    return this.$('[data-onfido-qa="client-session-linked-primary-btn"]')
  }

  async continueToNextStep() {
    this.continueButton().click()
  }

  async verifyUIElements(copy) {
    const screenCopy = copy.cross_device_session_linked
    verifyElementCopy(this.title(), screenCopy.title)
    verifyElementCopy(this.subtitle(), screenCopy.subtitle)
    this.icon().isDisplayed()
    verifyElementCopy(this.infoHeader(), screenCopy.info)
    const elements = [this.infoList()]
    asyncForEach(elements, async (item, index) => {
      const expectedCopies = [
        screenCopy.list_item_sent_by_you,
        screenCopy.list_item_desktop_open,
      ]
      verifyElementCopy(item, expectedCopies[index])
    })
    verifyElementCopy(this.continueButton(), screenCopy.button_primary)
  }

  async verifySubTitle(copy) {
    verifyElementCopy(
      this.subtitle(),
      copy.cross_device_session_linked.subtitle
    )
  }

  async verifySubTitleWithCustomText(copy) {
    verifyElementCopy(
      this.subtitle(),
      `${copy.cross_device_session_linked.subtitle} for a [COMPANY/PRODUCT NAME] loan`
    )
  }
}

export default CrossDeviceClientIntro
