import Base from './BasePage.js'
import {locale, verifyElementCopy} from '../utils/mochaw'

class CrossDeviceIntro extends Base {

  get title() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
  get smsIcon() { return this.$('.onfido-sdk-ui-crossDevice-Intro-stageIcon-sms')}
  get takePhotosIcon() { return this.$('.onfido-sdk-ui-crossDevice-Intro-stageIcon-take-photos')}
  get returnToComputerIcon() { return this.$('.onfido-sdk-ui-crossDevice-Intro-stageIcon-return-computer')}
  get smsMessage() { return this.$('.onfido-sdk-ui-crossDevice-Intro-stageMessage-sms')}
  get takePhotosMessage() { return this.$('.onfido-sdk-ui-crossDevice-Intro-stage:nth-child(2) > .onfido-sdk-ui-crossDevice-Intro-stageMessage')}
  get returnToComputerMessage() { return this.$('.onfido-sdk-ui-crossDevice-Intro-stage:nth-child(3) > .onfido-sdk-ui-crossDevice-Intro-stageMessage')}
  get continueButton() { return this.$('.onfido-sdk-ui-Button-button')}

  copy(lang) { return locale(lang) }

  async verifyTitle(copy) {
    const crossDeviceIntroStrings = copy.cross_device.intro
    verifyElementCopy(this.title, crossDeviceIntroStrings.document.title)
  }

  async verifyIcons() {
    this.smsIcon.isDisplayed()
    this.takePhotosIcon.isDisplayed()
    this.returnToComputerIcon.isDisplayed()
  }

  async verifyMessages(copy) {
    const crossDeviceIntroStrings = copy.cross_device.intro
    verifyElementCopy(this.smsMessage, crossDeviceIntroStrings.sms)
    verifyElementCopy(this.takePhotosMessage, crossDeviceIntroStrings.document.take_photos)
    verifyElementCopy(this.returnToComputerMessage, crossDeviceIntroStrings.return_computer)
  }
}

export default CrossDeviceIntro;
