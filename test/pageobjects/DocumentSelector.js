import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'

class DocumentSelector extends BasePage {
  async passportIcon() {
    return this.$('.onfido-sdk-ui-DocumentSelector-icon-passport')
  }
  async passportLabel() {
    return this.$(
      '[data-onfido-qa="passport"] .onfido-sdk-ui-DocumentSelector-label'
    )
  }
  async passportHint() {
    return this.$(
      '[data-onfido-qa="passport"] .onfido-sdk-ui-DocumentSelector-hint'
    )
  }
  async drivingLicenceIcon() {
    return this.$('.onfido-sdk-ui-DocumentSelector-icon-driving-licence')
  }
  async drivingLicenceLabel() {
    return this.$(
      '[data-onfido-qa="driving_licence"] .onfido-sdk-ui-DocumentSelector-label'
    )
  }
  async drivingLicenceHint() {
    return this.$(
      '[data-onfido-qa="driving_licence"] .onfido-sdk-ui-DocumentSelector-hint'
    )
  }
  async identityCardIcon() {
    return this.$('.onfido-sdk-ui-DocumentSelector-icon-national-identity-card')
  }
  async identityCardLabel() {
    return this.$(
      '[data-onfido-qa="national_identity_card"]  .onfido-sdk-ui-DocumentSelector-label'
    )
  }
  async identityCardHint() {
    return this.$(
      '[data-onfido-qa="national_identity_card"] .onfido-sdk-ui-DocumentSelector-hint'
    )
  }
  async residencePermitIcon() {
    return this.$('.onfido-sdk-ui-DocumentSelector-icon-residence-permit')
  }
  async residencePermitLabel() {
    return this.$(
      '[data-onfido-qa="residence_permit"] .onfido-sdk-ui-DocumentSelector-label'
    )
  }
  async residencePermitHint() {
    return this.$(
      '[data-onfido-qa="residence_permit"] .onfido-sdk-ui-DocumentSelector-hint'
    )
  }

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
    verifyElementCopy(this.passportLabel(), documentTypesStrings.passport)
    verifyElementCopy(
      this.drivingLicenceLabel(),
      documentTypesStrings.driving_licence
    )
    verifyElementCopy(
      this.identityCardLabel(),
      documentTypesStrings.national_identity_card
    )
    verifyElementCopy(
      this.residencePermitLabel(),
      documentTypesStrings.residence_permit
    )
  }

  async verifyHints(copy) {
    const documentSelectorStrings = copy.document_selector.identity
    verifyElementCopy(
      this.passportHint(),
      documentSelectorStrings.passport_hint
    )
    verifyElementCopy(
      this.drivingLicenceHint(),
      documentSelectorStrings.driving_licence_hint
    )
    verifyElementCopy(
      this.identityCardHint(),
      documentSelectorStrings.national_identity_card_hint
    )
    verifyElementCopy(
      this.residencePermitHint(),
      documentSelectorStrings.residence_permit_hint
    )
  }

  async verifyIcons() {
    this.passportIcon().isDisplayed()
    this.drivingLicenceIcon().isDisplayed()
    this.identityCardIcon().isDisplayed()
    this.residencePermitIcon().isDisplayed()
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

  async clickOnResidencePermitIcon() {
    this.residencePermitIcon().click()
  }
}

export default DocumentSelector
