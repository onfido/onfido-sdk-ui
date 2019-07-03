import Base from './BasePage.js'
import {locale, verifyElementCopy} from '../utils/mochaw'

class PoaIntro extends Base {
  get poaIntroTitle() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
  get poaIntroRequirements() { return this.$('.onfido-sdk-ui-ProofOfAddress-PoAIntro-requirements')}
  get poaIntroRequirement1() { return this.$('.onfido-sdk-ui-ProofOfAddress-PoAIntro-requirement:nth-child(2) > span')}
  get poaIntroRequirement2() { return this.$('.onfido-sdk-ui-ProofOfAddress-PoAIntro-requirement:nth-child(3) > span')}
  get poaIntroRequirement3() { return this.$('.onfido-sdk-ui-ProofOfAddress-PoAIntro-requirement:nth-child(4) > span')}
  get poaIntroStartVerificationButton() { return this.$('.onfido-sdk-ui-Button-button-text')}
  
  copy(lang) { return locale(lang) }

  async verifyPoaIntroTitle(copy) {
    verifyElementCopy(this.poaIntroTitle, copy)
  }

  async verifyPoaIntroRequirementsHeader(copy) {
    const poaIntroStrings = copy.proof_of_address
    verifyElementCopy(this.poaIntroRequirements, poaIntroStrings.intro.requirements)
  }

  async verifyPoaIntroFirstRequirement(copy) {
    verifyElementCopy(this.poaIntroRequirement1, copy)
  }

  async verifyPoaIntroSecondRequirement(copy) {
    verifyElementCopy(this.poaIntroRequirement2, copy)
  }

  async verifyPoaIntroThirdRequirement(copy) {
    verifyElementCopy(this.poaIntroRequirement3, copy)
  }

  async verifyPoaIntroStartVerificationButton(copy) {
    const poaIntroStrings = copy.proof_of_address
    verifyElementCopy(this.poaIntroStartVerificationButton, poaIntroStrings.intro.start)
  }

  async clickStartVerificationButton() {
    this.poaIntroStartVerificationButton.click()
  }
}

export default PoaIntro;
