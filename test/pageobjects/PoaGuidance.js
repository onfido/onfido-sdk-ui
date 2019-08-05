import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'

class PoaGuidance extends BasePage {
  get makeSure() { return this.$('.onfido-sdk-ui-ProofOfAddress-Guidance-makeSure')}
  get logoText() { return this.$('.onfido-sdk-ui-ProofOfAddress-Guidance-label:nth-child(7)')}
  get fullNameText() { return this.$('.onfido-sdk-ui-ProofOfAddress-Guidance-label:nth-child(1)')}
  get currentText() { return this.$('.onfido-sdk-ui-ProofOfAddress-Guidance-label:nth-child(2)')}
  get addressText() { return this.$('.onfido-sdk-ui-ProofOfAddress-Guidance-label:nth-child(3)')}
  get issueDateText() { return this.$('.onfido-sdk-ui-ProofOfAddress-Guidance-label:nth-child(4)')}
  get summaryPeriodText() { return this.$('.onfido-sdk-ui-ProofOfAddress-Guidance-label:nth-child(6')}
  get continueButton() { return this.$('.onfido-sdk-ui-Button-button-text')}
  get backButton() { return this.$('.onfido-sdk-ui-NavigationBar-iconBack')}
  get utilityBillIcon() { return this.$('.onfido-sdk-ui-DocumentSelector-icon-utility-bill')}
  get councilTaxLetterIcon() { return this.$('li:nth-child(3) .onfido-sdk-ui-DocumentSelector-icon')}
  get benefitsLetterIcon() { return this.$('li:nth-child(4) .onfido-sdk-ui-DocumentSelector-icon')}

  async verifyCopiesOnPoADocumentsGuidanceScreen(copy, docType) {
    const poaGudanceTitleStrings = copy['capture'][docType]['front']
    const poaGudanceStrings = copy.proof_of_address.guidance
    verifyElementCopy(super.title, poaGudanceTitleStrings['title'])
    verifyElementCopy(this.makeSure, poaGudanceStrings.make_sure_it_shows)
    verifyElementCopy(this.logoText, poaGudanceStrings.logo)
    verifyElementCopy(this.continueButton, poaGudanceStrings.continue)
  }

  async verifyTextOfTheElementsForPoADocumentsGuidance(months) {
    verifyElementCopy(super.subtitle, `Must be issued in the last ${months} months`)
    verifyElementCopy(this.fullNameText, 'Full name')
    verifyElementCopy(this.currentText, 'Current')
    verifyElementCopy(this.addressText, 'Address')
    verifyElementCopy(this.issueDateText, 'Issue date or')
    verifyElementCopy(this.summaryPeriodText, 'Summary period')
  }

  async clickOnContinueButton() {
    this.continueButton.click()
  }
}

export default PoaGuidance;
