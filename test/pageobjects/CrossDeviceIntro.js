import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'

class CrossDeviceIntro extends BasePage {
  async smsIcon() { return this.$('.onfido-sdk-ui-crossDevice-Intro-stageIcon-sms')}
  async takePhotosIcon() { return this.$('.onfido-sdk-ui-crossDevice-Intro-stageIcon-take-photos')}
  async returnToComputerIcon() { return this.$('.onfido-sdk-ui-crossDevice-Intro-stageIcon-return-to-computer')}
  async smsMessage() { return this.$('.onfido-sdk-ui-crossDevice-Intro-stageMessage-sms')}
  async takePhotosMessage() { return this.$('.onfido-sdk-ui-crossDevice-Intro-stageMessage-take-photos')}
  async returnToComputerMessage() { return this.$('.onfido-sdk-ui-crossDevice-Intro-stageMessage-return-to-computer')}
  async continueButton() { return this.$('.onfido-sdk-ui-Button-button')}

  async verifyTitle(copy) {
    const crossDeviceIntroStrings = copy.cross_device.intro
    verifyElementCopy(this.title(), crossDeviceIntroStrings.title)
  }

  async verifySubTitle(copy) {
    const crossDeviceIntroStrings = copy.cross_device.intro
    verifyElementCopy(this.subtitle(), crossDeviceIntroStrings.sub_title)
  }

  async verifyIcons() {
    this.smsIcon().isDisplayed()
    this.takePhotosIcon().isDisplayed()
    this.returnToComputerIcon().isDisplayed()
  }

  async verifyMessages(copy) {
    const crossDeviceIntroStrings = copy.cross_device.intro
    verifyElementCopy(this.smsMessage(), crossDeviceIntroStrings.description_li_1)
    verifyElementCopy(this.takePhotosMessage(), crossDeviceIntroStrings.description_li_2)
    verifyElementCopy(this.returnToComputerMessage(), crossDeviceIntroStrings.description_li_3)
  }

  async continueToNextStep() {
    this.clickWhenClickable(this.continueButton())
  }

}

export default CrossDeviceIntro;
