import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'

class PoaGuidance extends BasePage {
  async poaGuidanceSubtitle() {
    return this.$('.onfido-sdk-ui-ProofOfAddress-Guidance-subTitle')
  }
  async makeSure() {
    return this.$('.onfido-sdk-ui-ProofOfAddress-Guidance-makeSure')
  }
  async logoText() {
    return this.$('.onfido-sdk-ui-ProofOfAddress-Guidance-label:nth-child(7)')
  }
  async fullNameText() {
    return this.$('.onfido-sdk-ui-ProofOfAddress-Guidance-label:nth-child(1)')
  }
  async currentText() {
    return this.$('.onfido-sdk-ui-ProofOfAddress-Guidance-label:nth-child(2)')
  }
  async addressText() {
    return this.$('.onfido-sdk-ui-ProofOfAddress-Guidance-label:nth-child(3)')
  }
  async issueDateText() {
    return this.$('.onfido-sdk-ui-ProofOfAddress-Guidance-label:nth-child(4)')
  }
  async summaryPeriodText() {
    return this.$('.onfido-sdk-ui-ProofOfAddress-Guidance-label:nth-child(6')
  }
  async continueButton() {
    return this.$('[data-onfido-qa="poa-continue-btn"]')
  }
  async backButton() {
    return this.$('.onfido-sdk-ui-NavigationBar-iconBack')
  }
  async utilityBillIcon() {
    return this.$('.onfido-sdk-ui-DocumentSelector-icon-utility-bill')
  }
  async councilTaxLetterIcon() {
    return this.$('li:nth-child(3) .onfido-sdk-ui-DocumentSelector-icon')
  }
  async benefitsLetterIcon() {
    return this.$('li:nth-child(4) .onfido-sdk-ui-DocumentSelector-icon')
  }

  async verifyCopiesOnPoADocumentsGuidanceScreen(copy, docType) {
    const poaGudanceTitleStrings = {
      bank_building_society_statement: copy.doc_submit.title_bank_statement,
      utility_bill: copy.doc_submit.title_bill,
      council_tax: copy.doc_submit.title_tax_letter,
      benefit_letters: copy.doc_submit.title_benefits_letter,
      government_letter: copy.doc_submit.title_government_letter,
    }
    verifyElementCopy(this.title(), poaGudanceTitleStrings[docType])
    verifyElementCopy(this.makeSure(), copy.poa_guidance.instructions.label)
    verifyElementCopy(this.logoText(), copy.poa_guidance.instructions.logo)
    verifyElementCopy(this.continueButton(), copy.poa_guidance.button_primary)
  }

  async verifyTextOfTheElementsForPoADocumentsGuidance(months) {
    verifyElementCopy(
      this.poaGuidanceSubtitle(),
      `Must be issued in the last ${months} months`
    )
    verifyElementCopy(this.fullNameText(), 'Full name')
    verifyElementCopy(this.currentText(), 'Current')
    verifyElementCopy(this.addressText(), 'Address')
    verifyElementCopy(this.issueDateText(), 'Issue date or')
    verifyElementCopy(this.summaryPeriodText(), 'Summary period')
  }

  async clickOnContinueButton() {
    this.continueButton().click()
  }
}

export default PoaGuidance
