import Base from './BasePage.js'
import {locale, verifyElementCopy} from '../utils/mochaw'

class CrossDeviceClientSuccess extends Base {

  get title() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
  get subtitle() { return this.$('.onfido-sdk-ui-PageTitle-subTitle')}
  get icon() { return this.$('.onfido-sdk-ui-Theme-icon')}
  get fewSecondsToUpdateMessage() { return this.$('.onfido-sdk-ui-crossDevice-ClientSuccess-text')}

  copy(lang) { return locale(lang) }

  async verifyUIElements(copy) {
    const crossDeviceClientSuccessStrings = copy.cross_device.client_success
    verifyElementCopy(this.title, crossDeviceClientSuccessStrings.title)
    verifyElementCopy(this.subtitle, crossDeviceClientSuccessStrings.sub_title)
    this.icon.isDisplayed()
    verifyElementCopy(this.fewSecondsToUpdateMessage, crossDeviceClientSuccessStrings.body)
  }
}

export default CrossDeviceClientSuccess;
