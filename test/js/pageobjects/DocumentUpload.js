import Base from './BasePage.js'
const path = require('path')
import {locale, verifyElementCopy} from '../utils/mochaw'

class DocumentUpload extends Base {
  get title() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
  get crossDeviceIcon() { return this.$('.onfido-sdk-ui-crossDevice-SwitchDevice-icon')}
  get crossDeviceHeader() { return this.$('.onfido-sdk-ui-crossDevice-SwitchDevice-header')}
  get crossDeviceSubMessage() { return this.$('.onfido-sdk-ui-crossDevice-SwitchDevice-submessage')}
  get crossDeviceArrow() { return this.$('.onfido-sdk-ui-crossDevice-SwitchDevice-chevron')}
  get uploaderIcon() { return this.$('.onfido-sdk-ui-Theme-icon')}
  get uploaderInstructionsMessage() { return this.$('.onfido-sdk-ui-Uploader-instructionsCopy')}
  get uploaderBtn() { return this.$('.onfido-sdk-ui-Uploader-buttons')}
  getUploadInput() { return (async ()=>{
    const input = this.$('.onfido-sdk-ui-CustomFileInput-input')
    // eslint-disable-next-line prefer-arrow-callback
    this.driver.executeScript(function(el) {
      el.setAttribute('style','display: block !important')
    },input)
    return input
  })()}

  upload(filename) {
    const input = this.$('.onfido-sdk-ui-CustomFileInput-input')
    const pathToTestFiles = '../../features/helpers/resources/'
    const sendKeysToElement = input.sendKeys(path.join(__dirname, pathToTestFiles + filename))
    return sendKeysToElement
  }

  copy(lang) { return locale(lang) }

  async verifyCrossDeviceUIElements(copy) {
    const documentUploadCrossDeviceStrings = copy.cross_device.switch_device
    this.crossDeviceIcon.isDisplayed()
    verifyElementCopy(this.crossDeviceHeader, documentUploadCrossDeviceStrings.header)
    verifyElementCopy(this.crossDeviceSubMessage, documentUploadCrossDeviceStrings.submessage)
    this.crossDeviceArrow.isDisplayed()
  }

  async verifyUploaderIcon() {
    this.uploaderIcon.isDisplayed()
  }

  async verifyUploaderButton(copy) {
    const documentUploadStrings = copy.capture
    verifyElementCopy(this.uploaderBtn, documentUploadStrings.upload_file)
  }
  
  async verifyPassportTitle(copy) {
    const documentUploadStrings = copy.capture
    verifyElementCopy(this.title, documentUploadStrings.passport.front.title)
  }

  async verifyPassportInstructionMessage(copy) {
    const documentUploadStrings = copy.capture
    verifyElementCopy(this.uploaderInstructionsMessage, documentUploadStrings.passport.front.instructions)
  }

  async verifyFrontOfDrivingLicenceTitle(copy) {
    const documentUploadStrings = copy.capture
    verifyElementCopy(this.title, documentUploadStrings.driving_licence.front.title)
  }

  async verifyFrontOfDrivingLicenceInstructionMessage(copy) {
    const documentUploadStrings = copy.capture
    verifyElementCopy(this.uploaderInstructionsMessage, documentUploadStrings.driving_licence.front.instructions)
  }

  async verifyBackOfDrivingLicenceTitle(copy) {
    const documentUploadStrings = copy.capture
    verifyElementCopy(this.title, documentUploadStrings.driving_licence.back.title)
  }

  async verifyBackOfDrivingLicenceInstructionMessage(copy) {
    const documentUploadStrings = copy.capture
    verifyElementCopy(this.uploaderInstructionsMessage, documentUploadStrings.driving_licence.back.instructions)
  }

  async verifyFrontOfIdentityCardTitle(copy) {
    const documentUploadStrings = copy.capture
    verifyElementCopy(this.title, documentUploadStrings.national_identity_card.front.title)
  }

  async verifyFrontOfIdentityCardInstructionMessage(copy) {
    const documentUploadStrings = copy.capture
    verifyElementCopy(this.uploaderInstructionsMessage, documentUploadStrings.national_identity_card.front.instructions)
  }

  async verifyBackOfIdentityCardTitle(copy) {
    const documentUploadStrings = copy.capture
    verifyElementCopy(this.title, documentUploadStrings.national_identity_card.back.title)
  }

  async verifyBackOfIdentityCardInstructionMessage(copy) {
    const documentUploadStrings = copy.capture
    verifyElementCopy(this.uploaderInstructionsMessage, documentUploadStrings.national_identity_card.back.instructions)
  }

  async verifySelfieUploadTitle(copy) {
    const documentUploadStrings = copy.capture
    verifyElementCopy(this.title, documentUploadStrings.face.upload_title)
  }

  async verifySelfieUploadInstructions(copy) {
    const documentUploadStrings = copy.capture
    verifyElementCopy(this.uploaderInstructionsMessage, documentUploadStrings.face.instructions)
  }
}

export default DocumentUpload
