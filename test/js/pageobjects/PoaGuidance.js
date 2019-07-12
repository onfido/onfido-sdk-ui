import Base from './BasePage.js'
import {locale, verifyElementCopy} from '../utils/mochaw'

class PoaGuidance extends Base {
  get title() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
  get subtitle() { return this.$('.onfido-sdk-ui-ProofOfAddress-Guidance-subTitle')}
  get makeSure() { return this.$('.onfido-sdk-ui-ProofOfAddress-Guidance-makeSure')}
  get logoText() { return this.$('.onfido-sdk-ui-ProofOfAddress-Guidance-label:nth-child(7)')}
  get fullNameText() { return this.$('.onfido-sdk-ui-ProofOfAddress-Guidance-label:nth-child(1)')}
  get currentText() { return this.$('.onfido-sdk-ui-ProofOfAddress-Guidance-label:nth-child(2)')}
  get addressText() { return this.$('.onfido-sdk-ui-ProofOfAddress-Guidance-label:nth-child(3)')}
  get issueDateText() { return this.$('.onfido-sdk-ui-ProofOfAddress-Guidance-label:nth-child(4)')}
  get summaryPeriodText() { return this.$('.onfido-sdk-ui-ProofOfAddress-Guidance-label:nth-child(6')}
  get continueButton() { return this.$('.onfido-sdk-ui-Button-button-text')}

  copy(lang) { return locale(lang) }

  async verifyUIElementsForBankStatementGuidanceScreen(copy) {
    const poaGudanceTitleStrings = copy.capture.bank_building_society_statement.front
    const poaGudanceStrings = copy.proof_of_address.guidance
    verifyElementCopy(this.title, poaGudanceTitleStrings.title)
    verifyElementCopy(this.makeSure, poaGudanceStrings.make_sure_it_shows)
    verifyElementCopy(this.logoText, poaGudanceStrings.logo)
    verifyElementCopy(this.continueButton, poaGudanceStrings.continue)
  }

  async verifyUIElementsForUtilityBillGuidanceScreen(copy) {
    const poaGudanceTitleStrings = copy.capture.utility_bill.front
    const poaGudanceStrings = copy.proof_of_address.guidance
    verifyElementCopy(this.title, poaGudanceTitleStrings.title)
    verifyElementCopy(this.makeSure, poaGudanceStrings.make_sure_it_shows)
    verifyElementCopy(this.logoText, poaGudanceStrings.logo)
    verifyElementCopy(this.continueButton, poaGudanceStrings.continue)
  }

  async verifyUIElementsForCouncilTaxLetterGuidanceScreen(copy) {
    const poaGudanceTitleStrings = copy.capture.council_tax.front
    const poaGudanceStrings = copy.proof_of_address.guidance
    verifyElementCopy(this.title, poaGudanceTitleStrings.title)
    verifyElementCopy(this.makeSure, poaGudanceStrings.make_sure_it_shows)
    verifyElementCopy(this.logoText, poaGudanceStrings.logo)
    verifyElementCopy(this.continueButton, poaGudanceStrings.continue)
  }

  async verifyUIElementsForBenefitsLetterGuidanceScreen(copy) {
    const poaGudanceTitleStrings = copy.capture.benefit_letters.front
    const poaGudanceStrings = copy.proof_of_address.guidance
    verifyElementCopy(this.title, poaGudanceTitleStrings.title)
    verifyElementCopy(this.makeSure, poaGudanceStrings.make_sure_it_shows)
    verifyElementCopy(this.logoText, poaGudanceStrings.logo)
    verifyElementCopy(this.continueButton, poaGudanceStrings.continue)
  }

  async verifyTextOfTheElementsForPoADocs(months) {
    verifyElementCopy(this.subtitle, `Must be issued in the last ${months} months`)
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
