import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'
import { browserName, isRemoteBrowser } from '../main'

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
    await this.uploaderIcon().isDisplayed()
    await verifyElementCopy(this.subtitle(), copy.doc_submit.subtitle)
    await this.switchToCrossDeviceButton().isDisplayed()
    await verifyElementCopy(
      this.switchToCrossDeviceButton(),
      copy.doc_submit.button_primary
    )
  }

  async verifyUploaderButton(copy) {
    await verifyElementCopy(
      this.uploaderBtn(),
      copy.doc_submit.button_link_upload
    )
  }

  async verifyPassportTitle(copy) {
    await verifyElementCopy(this.title(), copy.doc_submit.title_passport)
  }

  async verifyFrontOfDrivingLicenceTitle(copy) {
    await verifyElementCopy(this.title(), copy.doc_submit.title_license_front)
  }

  async verifyBackOfDrivingLicenceTitle(copy) {
    await verifyElementCopy(this.title(), copy.doc_submit.title_license_back)
  }

  async verifyFrontOfIdentityCardTitle(copy) {
    await verifyElementCopy(this.title(), copy.doc_submit.title_id_front)
  }

  async verifyBackOfIdentityCardTitle(copy) {
    await verifyElementCopy(this.title(), copy.doc_submit.title_id_back)
  }

  async verifyFrontOfResidencePermitTitle(copy) {
    await verifyElementCopy(this.title(), copy.doc_submit.title_permit_front)
  }

  async verifyBackOfResidencePermitTitle(copy) {
    await verifyElementCopy(this.title(), copy.doc_submit.title_permit_back)
  }

  async verifySelfieUploadTitle(copy) {
    await verifyElementCopy(this.title(), copy.photo_upload.title_selfie)
  }

  async switchToCrossDevice() {
    this.switchToCrossDeviceButton().click()
  }

  async clickUploadButton() {
    this.uploaderBtn().click()
  }

  async clickUploadButtonIfRemoteIe() {
    if (browserName === 'IE' && isRemoteBrowser === true) {
      await this.clickUploadButton()
    }
  }
}

export default DocumentUpload
