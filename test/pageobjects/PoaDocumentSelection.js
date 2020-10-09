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
    verifyElementCopy(this.subtitle(), copy.doc_select.subtitle_poa)
  }

  async verifyElementsBankCell(copy) {
    this.bankIcon().isDisplayed()
    verifyElementCopy(
      this.bankLabel(),
      copy.poa_guidance.subtitle_bank_statement
    )
    // prettier-ignore
    verifyElementCopy(
      this.bankTag(),
      copy.doc_select.extra_estatements_ok
    )
  }

  async verifyElementsUtilityBillCell(copy) {
    this.utilityBillIcon().isDisplayed()
    verifyElementCopy(this.utilityBillLabel(), copy.doc_select.button_bill)
    // prettier-ignore
    verifyElementCopy(
      this.utilityBillHint(),
      copy.doc_select.button_bill_detail
    )
    // prettier-ignore
    verifyElementCopy(
      this.utilityBillWarning(),
      copy.doc_select.extra_no_mobile
    )
    // prettier-ignore
    verifyElementCopy(
      this.utilityBillTag(),
      copy.doc_select.extra_estatements_ok
    )
  }

  async verifyElementsCouncilTaxLetter(copy) {
    this.councilTaxLetterIcon().isDisplayed()
    verifyElementCopy(
      this.councilTaxLetterLabel(),
      copy.doc_select.button_tax_letter
    )
  }

  async verifyElementsBenefitsLetter(copy) {
    this.benefitsLetterIcon().isDisplayed()
    verifyElementCopy(
      this.benefitsLetterLabel(),
      copy.doc_select.button_benefits_letter
    )
    // prettier-ignore
    verifyElementCopy(
      this.benefitsLetterHint(),
      copy.doc_select.button_benefits_letter_detail
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
