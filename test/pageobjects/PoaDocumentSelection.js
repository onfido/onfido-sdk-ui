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
    await verifyElementCopy(this.title(), copy)
  }

  async verifySubtitle(copy) {
    await verifyElementCopy(this.subtitle(), copy.doc_select.subtitle_poa)
  }

  async verifyElementsBankCell(copy) {
    await this.bankIcon().isDisplayed()
    await verifyElementCopy(
      this.bankLabel(),
      copy.doc_select.button_bank_statement
    )
    await verifyElementCopy(
      this.bankTag(),
      copy.doc_select.extra_estatements_ok
    )
  }

  async verifyElementsUtilityBillCell(copy) {
    await this.utilityBillIcon().isDisplayed()
    await verifyElementCopy(
      this.utilityBillLabel(),
      copy.doc_select.button_bill
    )
    await verifyElementCopy(
      this.utilityBillHint(),
      copy.doc_select.button_bill_detail
    )
    await verifyElementCopy(
      this.utilityBillWarning(),
      copy.doc_select.extra_no_mobile
    )
    await verifyElementCopy(
      this.utilityBillTag(),
      copy.doc_select.extra_estatements_ok
    )
  }

  async verifyElementsCouncilTaxLetter(copy) {
    await this.councilTaxLetterIcon().isDisplayed()
    await verifyElementCopy(
      this.councilTaxLetterLabel(),
      copy.doc_select.button_tax_letter
    )
  }

  async verifyElementsBenefitsLetter(copy) {
    await this.benefitsLetterIcon().isDisplayed()
    await verifyElementCopy(
      this.benefitsLetterLabel(),
      copy.doc_select.button_benefits_letter
    )
    await verifyElementCopy(
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
