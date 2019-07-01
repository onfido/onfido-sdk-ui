import Base from './BasePage.js'
import {locale, verifyElementCopy} from '../utils/mochaw'

class CrossDeviceUploadsSuccessful extends Base {

  get uploadsSuccessfulTitle() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
  get uploadsSuccessfulSubtitle() { return this.$('.onfido-sdk-ui-PageTitle-titleWrapper > div:nth-child(2)')}
  get uploadsSuccessfulIcon() { return this.$('.onfido-sdk-ui-Theme-icon')}
  get uploadsSuccessfulFewSecondsToUpdateMessage() { return this.$('.onfido-sdk-ui-crossDevice-ClientSuccess-text')}

  copy(lang) { return locale(lang) }

  async verifyCrossDeviceUploadsSuccessfulUIElements(copy) {
    const uploadsSuccessfulScreenStrings = copy.cross_device.client_success
    verifyElementCopy(this.uploadsSuccessfulTitle, uploadsSuccessfulScreenStrings.title)
    verifyElementCopy(this.uploadsSuccessfulSubtitle, uploadsSuccessfulScreenStrings.sub_title)
    this.uploadsSuccessfulIcon.isDisplayed()
    verifyElementCopy(this.uploadsSuccessfulFewSecondsToUpdateMessage, uploadsSuccessfulScreenStrings.body)
  }
}

export default CrossDeviceUploadsSuccessful;
