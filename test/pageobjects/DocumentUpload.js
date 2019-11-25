import BasePage from './BasePage.js'
const path = require('path')
import { verifyElementCopy } from '../utils/mochaw'

class DocumentUpload extends BasePage {
  get crossDeviceHeader() { return this.$('.onfido-sdk-ui-crossDevice-SwitchDevice-header')}
  get switchToCrossDeviceButton() { return this.$('.onfido-sdk-ui-Uploader-crossDeviceButton')}
  get uploaderIcon() { return this.$('.onfido-sdk-ui-Uploader-icon')}
  get uploaderBtn() { return this.$('[data-onfido-qa="uploaderButtonLink"]')}

  async crossDeviceIcon() { return this.waitAndFind('.onfido-sdk-ui-crossDevice-SwitchDevice-icon')}
  async uploaderInstructionsMessage() { return this.waitAndFind('.onfido-sdk-ui-Uploader-instructionsCopy')}
  async uploadInput() { return this.waitAndFind('.onfido-sdk-ui-CustomFileInput-input') }
  async getUploadInput() {
    const input = this.uploadInput()
    this.driver.executeScript((el) => {
      el.setAttribute('style','display: block !important')
    }, input)
    return input
  }

  upload(filename) {
    const input = this.$('.onfido-sdk-ui-CustomFileInput-input')
    const pathToTestFiles = '../resources/'
    const sendKeysToElement = input.sendKeys(path.join(__dirname, pathToTestFiles + filename))
    return sendKeysToElement
  }

  async verifyCrossDeviceUIElements(copy) {
    const documentUploadCrossDeviceStrings = copy.cross_device.switch_device
    this.uploaderIcon.isDisplayed()
    verifyElementCopy(this.subtitle, documentUploadCrossDeviceStrings.header)
    this.switchToCrossDeviceButton.isDisplayed()
    verifyElementCopy(this.switchToCrossDeviceButton, copy.capture.switch_device)
  }

  async verifyUploaderButton(copy) {
    const documentUploadStrings = copy.capture
    verifyElementCopy(this.uploaderBtn, documentUploadStrings.upload_file)
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

  async verifySelfieUploadInstructions(copy) {
    const documentUploadStrings = copy.capture
    verifyElementCopy(this.uploaderInstructionsMessage(), documentUploadStrings.face.instructions)
  }
}

export default DocumentUpload
