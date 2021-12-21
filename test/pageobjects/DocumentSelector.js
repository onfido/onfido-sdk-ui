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
    await verifyElementCopy(this.title(), copy.doc_select.title)
  }

  async verifySubtitle(copy) {
    await verifyElementCopy(this.subtitle(), copy.doc_select.subtitle)
  }

  async verifyLabels(copy) {
    await verifyElementCopy(
      this.passportLabel(),
      copy.doc_select.button_passport
    )
    await verifyElementCopy(
      this.drivingLicenceLabel(),
      copy.doc_select.button_license
    )
    await verifyElementCopy(this.identityCardLabel(), copy.doc_select.button_id)
    await verifyElementCopy(
      this.residencePermitLabel(),
      copy.doc_select.button_permit
    )
  }

  async verifyHints(copy) {
    await verifyElementCopy(
      this.passportHint(),
      copy.doc_select.button_passport_detail
    )
    await verifyElementCopy(
      this.drivingLicenceHint(),
      copy.doc_select.button_license_detail
    )
    await verifyElementCopy(
      this.identityCardHint(),
      copy.doc_select.button_id_detail
    )
    await verifyElementCopy(
      this.residencePermitHint(),
      copy.doc_select.button_permit_detail
    )
  }

  async verifyIcons() {
    await this.passportIcon().isDisplayed()
    await this.drivingLicenceIcon().isDisplayed()
    await this.identityCardIcon().isDisplayed()
    await this.residencePermitIcon().isDisplayed()
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
