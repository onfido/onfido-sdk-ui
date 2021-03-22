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
    return this.$('[data-onfido-qa="selfie-continue-btn"]')
  }

  async verifyUIElementsOnTheSelfieIntroScreen(copy) {
    this.title().isDisplayed()
    verifyElementCopy(this.title(), copy.selfie_intro.title)
    this.selfieIcon().isDisplayed()
    this.glassesIcon().isDisplayed()
    verifyElementCopy(this.continueButton(), copy.selfie_intro.button_primary)
  }

  async clickOnContinueButton() {
    this.continueButton().click()
  }
}

export default SelfieIntro
