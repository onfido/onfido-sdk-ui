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
    return this.$('[data-onfido-qa="liveness-continue-btn"]')
  }

  async verifyUIElementsOnTheFaceVideoIntroScreen(copy) {
    await this.title().isDisplayed()
    await verifyElementCopy(this.title(), copy.video_intro.title)
    await this.cameraIcon().isDisplayed()
    await this.microphoneIcon().isDisplayed()
    await verifyElementCopy(
      this.continueButton(),
      copy.video_intro.button_primary
    )
  }
  async clickOnContinueButton() {
    this.continueButton().click()
  }
}

export default FaceVideoIntro
