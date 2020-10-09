import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'

class CrossDeviceSubmit extends BasePage {
  async documentUploadedMessage() {
    return this.$(
      'li:nth-child(1) > .onfido-sdk-ui-crossDevice-CrossDeviceSubmit-listText'
    )
  }
  async selfieUploadedMessage() {
    return this.$(
      'li:nth-child(2) > .onfido-sdk-ui-crossDevice-CrossDeviceSubmit-listText'
    )
  }
  async submitVerificationButton() {
    return this.$('.onfido-sdk-ui-Button-button-primary')
  }

  async verifyUIElements(copy) {
    verifyElementCopy(this.title(), copy.xdevice_checklist.title)
    verifyElementCopy(this.subtitle(), copy.xdevice_checklist.subtitle)
    verifyElementCopy(
      this.documentUploadedMessage(),
      copy.xdevice_checklist.list_item_doc_one
    )
    verifyElementCopy(
      this.selfieUploadedMessage(),
      copy.xdevice_checklist.list_item_selfie
    )
    verifyElementCopy(
      this.submitVerificationButton(),
      copy.xdevice_checklist.button_primary
    )
  }

  async clickOnSubmitVerificationButton() {
    this.submitVerificationButton().click()
  }
}

export default CrossDeviceSubmit
