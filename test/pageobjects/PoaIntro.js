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
    return this.$('[data-onfido-qa="poa-start-btn"]')
  }

  async verifyTitle(copy) {
    verifyElementCopy(this.title(), copy)
  }

  async verifyRequirementsHeader(copy) {
    verifyElementCopy(this.requirementsHeader(), copy.poa_intro.subtitle)
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
    verifyElementCopy(
      this.startVerificationButton(),
      copy.poa_intro.button_primary
    )
  }

  async clickStartVerificationButton() {
    this.startVerificationButton().click()
  }
}

export default PoaIntro
