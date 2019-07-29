import Base from './BasePage.js'
import {locale, verifyElementCopy} from '../utils/mochaw'

class LivenessIntro extends Base {
  get title() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
  get cameraIcon() { return this.$('.onfido-sdk-ui-Video-two_actionsIcon')}
  get microphoneIcon() { return this.$('.onfido-sdk-ui-Video-speak_out_loudIcon')}
  get continueButton() { return this.$('.onfido-sdk-ui-Button-button-text')}

  copy(lang) { return locale(lang) }

  async verifyUIElementsOnTheLivenessIntroScreen(copy) {
    const livenessIntroStrings = copy.capture.liveness.intro
    verifyElementCopy(this.title, livenessIntroStrings.title)
    this.cameraIcon.isDisplayed()
    this.microphoneIcon.isDisplayed()
    verifyElementCopy(this.continueButton, livenessIntroStrings.continue)
  }
  async clickOnContinueButton() {
    this.continueButton.click()
  }
}

export default LivenessIntro;


