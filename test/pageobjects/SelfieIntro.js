import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'

class SelfieIntro extends BasePage {
  get selfieIcon() { return this.$('.onfido-sdk-ui-Selfie-selfieIcon')}
  get glassesIcon() { return this.$('.onfido-sdk-ui-Selfie-glassesIcon')}
  get continueButton() { return this.$('.onfido-sdk-ui-Button-button-text')}

  async verifyUIElementsOnTheSelfieIntroScreen(copy) {
    const introStrings = copy.capture.face.intro
    this.title().isDisplayed()
    verifyElementCopy(this.title(), introStrings.title)
    this.selfieIcon.isDisplayed()
    this.glassesIcon.isDisplayed()
    verifyElementCopy(this.continueButton, copy.continue)
  }
  async clickOnContinueButton() {
    this.continueButton.click()
  }
}

export default SelfieIntro;
