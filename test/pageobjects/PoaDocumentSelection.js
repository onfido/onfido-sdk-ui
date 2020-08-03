import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'

class PoaDocumentSelection extends BasePage {
  async bankIcon() {
    return this.$(
      '.onfido-sdk-ui-DocumentSelector-icon-bank-building-society-statement'
    )
  }
  async bankLabel() {
    return this.$('li:nth-child(1) .onfido-sdk-ui-DocumentSelector-label')
  }
  async bankTag() {
    return this.$('li:nth-child(1) .onfido-sdk-ui-DocumentSelector-tag')
  }
  async utilityBillIcon() {
    return this.$('.onfido-sdk-ui-DocumentSelector-icon-utility-bill')
  }
  async utilityBillLabel() {
    return this.$('li:nth-child(2) .onfido-sdk-ui-DocumentSelector-label')
  }
  async utilityBillHint() {
    return this.$('li:nth-child(2) .onfido-sdk-ui-DocumentSelector-hint')
  }
  async utilityBillWarning() {
    return this.$('.onfido-sdk-ui-DocumentSelector-warning')
  }
  async utilityBillTag() {
    return this.$('li:nth-child(2) .onfido-sdk-ui-DocumentSelector-tag')
  }
  async councilTaxLetterIcon() {
    return this.$('li:nth-child(3) .onfido-sdk-ui-DocumentSelector-icon')
  }
  async councilTaxLetterLabel() {
    return this.$('li:nth-child(3) .onfido-sdk-ui-DocumentSelector-label')
  }
  async benefitsLetterIcon() {
    return this.$('li:nth-child(4) .onfido-sdk-ui-DocumentSelector-icon')
  }
  async benefitsLetterLabel() {
    return this.$('li:nth-child(4) .onfido-sdk-ui-DocumentSelector-label')
  }
  async benefitsLetterHint() {
    return this.$('li:nth-child(4) .onfido-sdk-ui-DocumentSelector-hint')
  }

  async verifyTitle(copy) {
    verifyElementCopy(this.title(), copy)
  }

  async verifySubtitle(copy) {
    const poaDocumentSelectionStrings = copy.document_selector.proof_of_address
    verifyElementCopy(this.subtitle(), poaDocumentSelectionStrings.hint)
  }

  async verifyElementsBankCell(copy) {
    const poaDocumentSelectionStrings = copy
    this.bankIcon().isDisplayed()
    verifyElementCopy(
      this.bankLabel(),
      poaDocumentSelectionStrings.bank_building_society_statement
    )
    // prettier-ignore
    verifyElementCopy(
      this.bankTag(),
      poaDocumentSelectionStrings.document_selector.proof_of_address.estatements_accepted
    )
  }

  async verifyElementsUtilityBillCell(copy) {
    const poaDocumentSelectionStrings = copy
    this.utilityBillIcon().isDisplayed()
    verifyElementCopy(
      this.utilityBillLabel(),
      poaDocumentSelectionStrings.utility_bill
    )
    // prettier-ignore
    verifyElementCopy(
      this.utilityBillHint(),
      poaDocumentSelectionStrings.document_selector.proof_of_address.utility_bill_hint
    )
    // prettier-ignore
    verifyElementCopy(
      this.utilityBillWarning(),
      poaDocumentSelectionStrings.document_selector.proof_of_address.utility_bill_warning
    )
    // prettier-ignore
    verifyElementCopy(
      this.utilityBillTag(),
      poaDocumentSelectionStrings.document_selector.proof_of_address.estatements_accepted
    )
  }

  async verifyElementsCouncilTaxLetter(copy) {
    const poaDocumentSelectionStrings = copy
    this.councilTaxLetterIcon().isDisplayed()
    verifyElementCopy(
      this.councilTaxLetterLabel(),
      poaDocumentSelectionStrings.council_tax
    )
  }

  async verifyElementsBenefitsLetter(copy) {
    const poaDocumentSelectionStrings = copy
    this.benefitsLetterIcon().isDisplayed()
    verifyElementCopy(
      this.benefitsLetterLabel(),
      poaDocumentSelectionStrings.benefit_letters
    )
    // prettier-ignore
    verifyElementCopy(
      this.benefitsLetterHint(),
      poaDocumentSelectionStrings.document_selector.proof_of_address.benefits_letter_hint
    )
  }

  async clickOnBankIcon() {
    this.bankIcon().click()
  }

  async clickOnUtilityBillIcon() {
    this.utilityBillIcon().click()
  }

  async clickOnCouncilTaxLetterIcon() {
    this.councilTaxLetterIcon().click()
  }

  async clickOnBenefitsLetterIcon() {
    this.benefitsLetterIcon().click()
  }
}

export default PoaDocumentSelection
