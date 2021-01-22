import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'

class FaceVideoIntro extends BasePage {
  async cameraIcon() {
    return this.$('.onfido-sdk-ui-FaceVideo-twoActionsIcon')
  }
  async microphoneIcon() {
    return this.$('.onfido-sdk-ui-FaceVideo-speakOutLoudIcon')
  }
  async continueButton() {
    return this.$('.onfido-sdk-ui-Button-button-text')
  }

  async verifyUIElementsOnTheFaceVideoIntroScreen(copy) {
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

export default FaceVideoIntro
