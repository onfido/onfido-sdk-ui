import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'

class SelfieIntro extends BasePage {
  async selfieIcon() {
    return this.$('.onfido-sdk-ui-Photo-selfieIcon')
  }
  async glassesIcon() {
    return this.$('.onfido-sdk-ui-Photo-glassesIcon')
  }
  async continueButton() {
    return this.$('.onfido-sdk-ui-Button-button-text')
  }

  async verifyUIElementsOnTheSelfieIntroScreen(copy) {
    const introStrings = copy.capture.face.intro
    this.title().isDisplayed()
    verifyElementCopy(this.title(), introStrings.title)
    this.selfieIcon().isDisplayed()
    this.glassesIcon().isDisplayed()
    verifyElementCopy(this.continueButton(), copy.continue)
  }

  async clickOnContinueButton() {
    this.continueButton().click()
  }
}

export default SelfieIntro
