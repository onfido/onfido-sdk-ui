import BasePage from './BasePage.js'
const path = require('path')
import { verifyElementCopy } from '../utils/mochaw'

class DocumentUpload extends BasePage {
  async crossDeviceHeader() { return this.$('.onfido-sdk-ui-crossDevice-SwitchDevice-header')}
  async switchToCrossDeviceButton() { return this.$('.onfido-sdk-ui-Uploader-crossDeviceButton')}
  async uploaderIcon() { return this.$('.onfido-sdk-ui-Uploader-icon')}
  async uploaderBtn() { return this.$('[data-onfido-qa="uploaderButtonLink"]')}

  async uploadInput() { return this.$('.onfido-sdk-ui-CustomFileInput-input') }
  async getUploadInput() {
    const input = this.uploadInput()
    this.driver.executeScript((el) => {
      el.setAttribute('style','display: block !important')
    }, input)
    return input
  }

  async upload(filename) {
    // Input here cannot use the uploadInput() function above
    const input = this.$('.onfido-sdk-ui-CustomFileInput-input')
    const pathToTestFiles = '../resources/'
    const sendKeysToElement = input.sendKeys(path.join(__dirname, pathToTestFiles + filename))
    return sendKeysToElement
  }

  async verifyCrossDeviceUIElements(copy) {
    const documentUploadCrossDeviceStrings = copy.cross_device.switch_device
    this.uploaderIcon().isDisplayed()
    verifyElementCopy(this.subtitle(), documentUploadCrossDeviceStrings.header)
    this.switchToCrossDeviceButton().isDisplayed()
    verifyElementCopy(this.switchToCrossDeviceButton(), copy.capture.switch_device)
  }

  async verifyUploaderButton(copy) {
    const documentUploadStrings = copy.capture
    verifyElementCopy(this.uploaderBtn(), documentUploadStrings.upload_file)
  }

  async verifyPassportTitle(copy) {
    const documentUploadStrings = copy.capture
    verifyElementCopy(this.title(), documentUploadStrings.passport.front.title)
  }

  async verifyFrontOfDrivingLicenceTitle(copy) {
    const documentUploadStrings = copy.capture
    verifyElementCopy(this.title(), documentUploadStrings.driving_licence.front.title)
  }

  async verifyBackOfDrivingLicenceTitle(copy) {
    const documentUploadStrings = copy.capture
    verifyElementCopy(this.title(), documentUploadStrings.driving_licence.back.title)
  }

  async verifyFrontOfIdentityCardTitle(copy) {
    const documentUploadStrings = copy.capture
    verifyElementCopy(this.title(), documentUploadStrings.national_identity_card.front.title)
  }

  async verifyBackOfIdentityCardTitle(copy) {
    const documentUploadStrings = copy.capture
    verifyElementCopy(this.title(), documentUploadStrings.national_identity_card.back.title)
  }

  async verifySelfieUploadTitle(copy) {
    const documentUploadStrings = copy.capture
    verifyElementCopy(this.title(), documentUploadStrings.face.upload_title)
  }

  async switchToCrossDevice() {
    this.clickWhenClickable(this.switchToCrossDeviceButton())
  }
}

export default DocumentUpload
