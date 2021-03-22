import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'

class CrossDeviceIntro extends BasePage {
  async smsIcon() {
    return this.$('.onfido-sdk-ui-crossDevice-Intro-stageIcon-sms')
  }
  async takePhotosIcon() {
    return this.$('.onfido-sdk-ui-crossDevice-Intro-stageIcon-take-photos')
  }
  async returnToComputerIcon() {
    return this.$(
      '.onfido-sdk-ui-crossDevice-Intro-stageIcon-return-to-computer'
    )
  }
  async smsMessage() {
    return this.$('.onfido-sdk-ui-crossDevice-Intro-stageMessage-sms')
  }
  async takePhotosMessage() {
    return this.$('.onfido-sdk-ui-crossDevice-Intro-stageMessage-take-photos')
  }
  async returnToComputerMessage() {
    return this.$(
      '.onfido-sdk-ui-crossDevice-Intro-stageMessage-return-to-computer'
    )
  }
  async continueButton() {
    return this.$('[data-onfido-qa="cross-device-continue-btn"]')
  }

  async verifyTitle(copy) {
    verifyElementCopy(this.title(), copy.cross_device_intro.title)
  }

  async verifySubTitle(copy) {
    verifyElementCopy(this.subtitle(), copy.cross_device_intro.subtitle)
  }

  async verifyIcons() {
    this.smsIcon().isDisplayed()
    this.takePhotosIcon().isDisplayed()
    this.returnToComputerIcon().isDisplayed()
  }

  async verifyMessages(copy) {
    verifyElementCopy(
      this.smsMessage(),
      copy.cross_device_intro.list_item_send_phone
    )
    verifyElementCopy(
      this.takePhotosMessage(),
      copy.cross_device_intro.list_item_open_link
    )
    verifyElementCopy(
      this.returnToComputerMessage(),
      copy.cross_device_intro.list_item_finish
    )
  }

  async continueToNextStep() {
    this.continueButton().click()
  }
}

export default CrossDeviceIntro
