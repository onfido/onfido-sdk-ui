import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'

class PoaIntro extends BasePage {
  async requirementsHeader() {
    return this.$('.onfido-sdk-ui-ProofOfAddress-PoAIntro-requirements')
  }
  async firstRequirement() {
    return this.$(
      '.onfido-sdk-ui-ProofOfAddress-PoAIntro-requirement:nth-child(2) > span'
    )
  }
  async secondRequirement() {
    return this.$(
      '.onfido-sdk-ui-ProofOfAddress-PoAIntro-requirement:nth-child(3) > span'
    )
  }
  async thirdRequirement() {
    return this.$(
      '.onfido-sdk-ui-ProofOfAddress-PoAIntro-requirement:nth-child(4) > span'
    )
  }
  async startVerificationButton() {
    return this.$('.onfido-sdk-ui-Button-button-text')
  }

  async verifyTitle(copy) {
    verifyElementCopy(this.title(), copy)
  }

  async verifyRequirementsHeader(copy) {
    const poaIntroStrings = copy.proof_of_address
    verifyElementCopy(
      this.requirementsHeader(),
      poaIntroStrings.intro.requirements
    )
  }

  async verifyFirstRequirement(copy) {
    verifyElementCopy(this.firstRequirement(), copy)
  }

  async verifySecondRequirement(copy) {
    verifyElementCopy(this.secondRequirement(), copy)
  }

  async verifyThirdRequirement(copy) {
    verifyElementCopy(this.thirdRequirement(), copy)
  }

  async verifyStartVerificationButton(copy) {
    const poaIntroStrings = copy.proof_of_address
    verifyElementCopy(
      this.startVerificationButton(),
      poaIntroStrings.intro.start
    )
  }

  async clickStartVerificationButton() {
    this.startVerificationButton().click()
  }
}

export default PoaIntro
