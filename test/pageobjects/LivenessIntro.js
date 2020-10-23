import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'

class LivenessIntro extends BasePage {
  async cameraIcon() {
    return this.$('.onfido-sdk-ui-Video-twoActionsIcon')
  }
  async microphoneIcon() {
    return this.$('.onfido-sdk-ui-Video-speakOutLoudIcon')
  }
  async continueButton() {
    return this.$('[data-onfido-qa="liveness-continue-btn"]')
  }

  async verifyUIElementsOnTheLivenessIntroScreen(copy) {
    this.title().isDisplayed()
    verifyElementCopy(this.title(), copy.video_intro.title)
    this.cameraIcon().isDisplayed()
    this.microphoneIcon().isDisplayed()
    verifyElementCopy(this.continueButton(), copy.video_intro.button_primary)
  }
  async clickOnContinueButton() {
    this.continueButton().click()
  }
}

export default LivenessIntro
