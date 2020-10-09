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
    return this.$('.onfido-sdk-ui-Button-button')
  }

  async verifyTitle(copy) {
    verifyElementCopy(this.title(), copy.xdevice_intro.title)
  }

  async verifySubTitle(copy) {
    verifyElementCopy(this.subtitle(), copy.xdevice_intro.subtitle)
  }

  async verifyIcons() {
    this.smsIcon().isDisplayed()
    this.takePhotosIcon().isDisplayed()
    this.returnToComputerIcon().isDisplayed()
  }

  async verifyMessages(copy) {
    verifyElementCopy(
      this.smsMessage(),
      copy.xdevice_intro.list_item_send_phone
    )
    verifyElementCopy(
      this.takePhotosMessage(),
      copy.xdevice_intro.list_item_open_link
    )
    verifyElementCopy(
      this.returnToComputerMessage(),
      copy.xdevice_intro.list_item_finish
    )
  }

  async continueToNextStep() {
    this.continueButton().click()
  }
}

export default CrossDeviceIntro
