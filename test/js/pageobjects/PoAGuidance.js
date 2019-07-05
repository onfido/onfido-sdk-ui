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

  async verifySubtitle(copy) {
    verifyElementCopy(this.subtitle, copy)
  }

  async verifyFullNameText(copy) {
    verifyElementCopy(this.fullNameText, copy)
  }

  async verifyCurrentText(copy) {
    verifyElementCopy(this.currentText, copy)
  }

  async verifyAddressText(copy) {
    verifyElementCopy(this.addressText, copy)
  }

  async verifyIssueDateText(copy) {
    verifyElementCopy(this.issueDateText, copy)
  }

  async verifySummaryPeriodText(copy) {
    verifyElementCopy(this.summaryPeriodText, copy)
  }


}
export default PoaGuidance;
