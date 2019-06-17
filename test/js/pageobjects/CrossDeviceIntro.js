import Base from './BasePage.js'
import {locale, verifyElementCopy} from '../utils/mochaw'

class CrossDeviceIntro extends Base{

  get crossDeviceIntroTitle() { return this.$('.onfido-sdk-ui-Title-titleSpan')}
  get smsIcon() { return this.$('.onfido-sdk-ui-crossDevice-Intro-stageIcon-sms')}
  get takePhotosIcon() { return this.$('.onfido-sdk-ui-crossDevice-Intro-stageIcon-take-photos')}
  get returnToComputerIcon() { return this.$('.onfido-sdk-ui-crossDevice-Intro-stageIcon-return-computer')}
  get smsMessage() { return this.$('.onfido-sdk-ui-crossDevice-Intro-stage:nth-child(1) > .onfido-sdk-ui-crossDevice-Intro-stageMessage')}
  get takePhotosMessage() { return this.$('.onfido-sdk-ui-crossDevice-Intro-stage:nth-child(2) > .onfido-sdk-ui-crossDevice-Intro-stageMessage')}
  get returnToComputerMessage() { return this.$('.onfido-sdk-ui-crossDevice-Intro-stage:nth-child(3) > .onfido-sdk-ui-crossDevice-Intro-stageMessage')}
  get letsStartButton() { return this.$('.onfido-sdk-ui-Button-button')}

  copy(lang) { return locale(lang) }

  verifyCrossDeviceIntroTitle(copy) {
    const crossDeviceIntroScreentrings = copy.cross_device.intro
      verifyElementCopy(this.crossDeviceIntroTitle), crossDeviceIntroScreentrings.document.title
  }

  verifyCrossDeviceIntroIcons() {
    verifyElementCopy(this.smsIcon)
    verifyElementCopy(this.takePhotosIcon)
    verifyElementCopy(this.returnToComputerIcon)
  }

  verifyCrossDeviceIntroMessages(copy) {
    const crossDeviceIntroScreentrings = copy.cross_device.intro
    verifyElementCopy(this.smsMessage, crossDeviceIntroScreentrings.sms)
    verifyElementCopy(this.takePhotosMessage, crossDeviceIntroScreentrings.document.take_photos)
    verifyElementCopy(this.returnToComputerMessage, crossDeviceIntroScreentrings.return_computer)
  }
}

export default CrossDeviceIntro;
