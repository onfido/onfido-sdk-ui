import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'

class LivenessIntro extends BasePage {
  get cameraIcon() { return this.$('.onfido-sdk-ui-Video-two_actionsIcon')}
  get microphoneIcon() { return this.$('.onfido-sdk-ui-Video-speak_out_loudIcon')}
  get continueButton() { return this.$('.onfido-sdk-ui-Button-button-text')}

  async verifyUIElementsOnTheLivenessIntroScreen(copy) {
    const livenessIntroStrings = copy.capture.liveness.intro
    this.driver.sleep(500)
    verifyElementCopy(super.title, livenessIntroStrings.title)
    this.cameraIcon.isDisplayed()
    this.microphoneIcon.isDisplayed()
    verifyElementCopy(this.continueButton, livenessIntroStrings.continue)
  }
  async clickOnContinueButton() {
    this.continueButton.click()
  }
}

export default LivenessIntro;
