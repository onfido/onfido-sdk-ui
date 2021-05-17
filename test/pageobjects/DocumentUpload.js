import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'

class DocumentUpload extends BasePage {
  async crossDeviceHeader() {
    return this.$('.onfido-sdk-ui-crossDevice-SwitchDevice-header')
  }
  async switchToCrossDeviceButton() {
    return this.$('.onfido-sdk-ui-Uploader-crossDeviceButton')
  }
  async uploaderIcon() {
    return this.$('.onfido-sdk-ui-Uploader-icon')
  }
  async uploaderBtn() {
    return this.$('[data-onfido-qa="uploaderButtonLink"]')
  }

  async uploadInput() {
    return this.$('.onfido-sdk-ui-CustomFileInput-input')
  }
  async getUploadInput() {
    const input = this.uploadInput()
    this.driver.executeScript((el) => {
      el.setAttribute('style', 'display: block !important')
    }, input)
    return input
  }

  async verifyCrossDeviceUIElements(copy) {
    this.uploaderIcon().isDisplayed()
    verifyElementCopy(this.subtitle(), copy.doc_submit.subtitle)
    this.switchToCrossDeviceButton().isDisplayed()
    verifyElementCopy(
      this.switchToCrossDeviceButton(),
      copy.doc_submit.button_primary
    )
  }

  async verifyUploaderButton(copy) {
    verifyElementCopy(this.uploaderBtn(), copy.doc_submit.button_link_upload)
  }

  async verifyPassportTitle(copy) {
    verifyElementCopy(this.title(), copy.doc_submit.title_passport)
  }

  async verifyFrontOfDrivingLicenceTitle(copy) {
    verifyElementCopy(this.title(), copy.doc_submit.title_license_front)
  }

  async verifyBackOfDrivingLicenceTitle(copy) {
    verifyElementCopy(this.title(), copy.doc_submit.title_license_back)
  }

  async verifyFrontOfIdentityCardTitle(copy) {
    verifyElementCopy(this.title(), copy.doc_submit.title_id_front)
  }

  async verifyBackOfIdentityCardTitle(copy) {
    verifyElementCopy(this.title(), copy.doc_submit.title_id_back)
  }

  async verifyFrontOfResidencePermitTitle(copy) {
    verifyElementCopy(this.title(), copy.doc_submit.title_permit_front)
  }

  async verifyBackOfResidencePermitTitle(copy) {
    verifyElementCopy(this.title(), copy.doc_submit.title_permit_back)
  }

  async verifySelfieUploadTitle(copy) {
    verifyElementCopy(this.title(), copy.photo_upload.title_selfie)
  }

  async switchToCrossDevice() {
    this.switchToCrossDeviceButton().click()
  }

  async clickUploadButton() {
    this.uploaderBtn().click()
  }
}

export default DocumentUpload
