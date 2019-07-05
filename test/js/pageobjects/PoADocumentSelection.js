import Base from './BasePage.js'
import {locale, verifyElementCopy} from '../utils/mochaw'

class PoaDocumentSelection extends Base {
  get title() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
  get subtitle() { return this.$('.onfido-sdk-ui-PageTitle-subTitle')}
  get bankIcon() { return this.$('.onfido-sdk-ui-DocumentSelector-icon-bank-building-society-statement')}
  get bankLabel() { return this.$('li:nth-child(1) .onfido-sdk-ui-DocumentSelector-label')}
  get bankTag() { return this.$('li:nth-child(1) .onfido-sdk-ui-DocumentSelector-tag')}
  get utilityBillIcon() { return this.$('.onfido-sdk-ui-DocumentSelector-icon-utility-bill')}
  get utilityBillLabel() { return this.$('li:nth-child(2) .onfido-sdk-ui-DocumentSelector-label')}
  get utilityBillHint() { return this.$('li:nth-child(2) .onfido-sdk-ui-DocumentSelector-hint')}
  get utilityBillWarning() { return this.$('.onfido-sdk-ui-DocumentSelector-warning')}
  get utilityBillTag() { return this.$('li:nth-child(2) .onfido-sdk-ui-DocumentSelector-tag')}
  get councilTaxLetterIcon() { return this.$('li:nth-child(3) .onfido-sdk-ui-DocumentSelector-icon')}
  get councilTaxLetterLabel() { return this.$('li:nth-child(3) .onfido-sdk-ui-DocumentSelector-label')}
  get benefitsLetterIcon() { return this.$('li:nth-child(4) .onfido-sdk-ui-DocumentSelector-icon')}
  get benefitsLetterLabel() { return this.$('li:nth-child(4) .onfido-sdk-ui-DocumentSelector-label')}
  get benefitsLetterHint() { return this.$('li:nth-child(4) .onfido-sdk-ui-DocumentSelector-hint')}
  
  copy(lang) { return locale(lang) }

  async verifyTitle(copy) {
    verifyElementCopy(this.title, copy)
  }

  async verifySubtitle(copy) {
    const poaDocumentSelectionStrings = copy.document_selector.proof_of_address
    verifyElementCopy(this.subtitle, poaDocumentSelectionStrings.hint)
  }

  async verifyElementsBankCell(copy) {
    const poaDocumentSelectionStrings = copy
    this.bankIcon.isDisplayed()
    verifyElementCopy(this.bankLabel, poaDocumentSelectionStrings.bank_building_society_statement)
    verifyElementCopy(this.bankTag, poaDocumentSelectionStrings.document_selector.proof_of_address.estatements_accepted)
  }

  async verifyElementsUtilityBillCell(copy) {
    const poaDocumentSelectionStrings = copy
    this.utilityBillIcon.isDisplayed()
    verifyElementCopy(this.utilityBillLabel, poaDocumentSelectionStrings.utility_bill)
    verifyElementCopy(this.utilityBillHint, poaDocumentSelectionStrings.document_selector.proof_of_address.utility_bill_hint)
    verifyElementCopy(this.utilityBillWarning, poaDocumentSelectionStrings.document_selector.proof_of_address.utility_bill_warning)
    verifyElementCopy(this.utilityBillTag, poaDocumentSelectionStrings.document_selector.proof_of_address.estatements_accepted)
  }

  async verifyElementsCouncilTaxLetter(copy) {
    const poaDocumentSelectionStrings = copy
    this.councilTaxLetterIcon.isDisplayed()
    verifyElementCopy(this.councilTaxLetterLabel, poaDocumentSelectionStrings.council_tax)
  }

  async verifyElementsBenefitsLetter(copy) {
    const poaDocumentSelectionStrings = copy
    this.benefitsLetterIcon.isDisplayed()
    verifyElementCopy(this.benefitsLetterLabel, poaDocumentSelectionStrings.benefit_letters)
    verifyElementCopy(this.benefitsLetterHint, poaDocumentSelectionStrings.document_selector.proof_of_address.benefits_letter_hint)
  }

  async clickOnBankIcon() {
    this.bankIcon.click()
  }

  async clickOnUtilityBillIcon() {
    this.utilityBillIcon.click()
  }

  async clickOnCouncilTaxLetterIcon() {
    this.councilTaxLetterIcon.click()
  }

  async clickOnBenefitsLetterIcon() {
    this.benefitsLetterIcon.click()
  }

}

export default PoaDocumentSelection;
