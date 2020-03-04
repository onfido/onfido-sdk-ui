import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'

class DocumentSelector extends BasePage {
  async passportIcon() { return this.$('.onfido-sdk-ui-DocumentSelector-icon-passport')}
  async documentSelectionLabel() { return this.$('.onfido-sdk-ui-DocumentSelector-label')}
  async documentSelectionHint() { return this.$('.onfido-sdk-ui-DocumentSelector-hint')}
  async drivingLicenceIcon() { return this.$('.onfido-sdk-ui-DocumentSelector-icon-driving-licence')}
  async drivingLicenceLabel() { return this.$('li:nth-child(2) .onfido-sdk-ui-DocumentSelector-label')}
  async drivingLicenceHint() { return this.$('li:nth-child(2) .onfido-sdk-ui-DocumentSelector-hint')}
  async identityCardIcon() { return this.$('.onfido-sdk-ui-DocumentSelector-icon-national-identity-card')}
  async identityCardLabel() { return this.$('li:nth-child(3) .onfido-sdk-ui-DocumentSelector-label')}
  async identityCardHint() { return this.$('li:nth-child(3) .onfido-sdk-ui-DocumentSelector-hint')}

  async verifyTitle(copy) {
    const documentSelectorStrings = copy.document_selector.identity
    verifyElementCopy(this.title(), documentSelectorStrings.title)
  }

  async verifySubtitle(copy) {
    const documentSelectorStrings = copy.document_selector.identity
    verifyElementCopy(this.subtitle(), documentSelectorStrings.hint)
  }

  async verifyLabels(copy) {
    const documentTypesStrings = copy
    verifyElementCopy(this.documentSelectionLabel(), documentTypesStrings.passport)
    verifyElementCopy(this.drivingLicenceLabel(), documentTypesStrings.driving_licence)
    verifyElementCopy(this.identityCardLabel(), documentTypesStrings.national_identity_card)
  }

  async verifyHints(copy) {
    const documentSelectorStrings = copy.document_selector.identity
    verifyElementCopy(this.documentSelectionHint(), documentSelectorStrings.passport_hint)
    verifyElementCopy(this.drivingLicenceHint(), documentSelectorStrings.driving_licence_hint)
    verifyElementCopy(this.identityCardHint(), documentSelectorStrings.national_identity_card_hint)
  }

  async verifyIcons() {
    this.passportIcon().isDisplayed()
    this.drivingLicenceIcon().isDisplayed()
    this.identityCardIcon().isDisplayed()
  }

  async clickOnPassportIcon() {
    this.passportIcon().click()
  }

  async clickOnDrivingLicenceIcon() {
    this.drivingLicenceIcon().click()
  }

  async clickOnIdentityCardIcon() {
    this.identityCardIcon().click()
  }

}

export default DocumentSelector
