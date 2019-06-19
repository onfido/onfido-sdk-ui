import Base from './BasePage.js'
const path = require('path')
import {locale, verifyElementCopy} from '../utils/mochaw'

class DocumentUpload extends Base{
    get title() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
    get crossDeviceIcon() { return this.$('.onfido-sdk-ui-crossDevice-SwitchDevice-icon')}
    get crossDeviceHeader() { return this.$('.onfido-sdk-ui-crossDevice-SwitchDevice-header')}
    get crossDeviceSubMessage() { return this.$('.onfido-sdk-ui-crossDevice-SwitchDevice-submessage')}
    get crossDeviceArrow() { return this.$('.onfido-sdk-ui-crossDevice-SwitchDevice-chevron')}
    get uploaderIcon() { return this.$('.onfido-sdk-ui-Theme-icon')}
    get uploaderInstructionsMessage() { return this.$('.onfido-sdk-ui-Uploader-instructionsCopy')}
    get uploaderBtn() { return this.$('.onfido-sdk-ui-Uploader-buttons')}
    get uploaderError() { return this.$('.onfido-sdk-ui-Uploader-error')}
    getUploadInput() { return (async ()=>{
      const input = this.$('.onfido-sdk-ui-CustomFileInput-input')
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
      const documentUploadScreenCrossDeviceStrings = copy.cross_device.switch_device
      this.crossDeviceIcon.isDisplayed()
      verifyElementCopy(this.crossDeviceHeader, documentUploadScreenCrossDeviceStrings.header)
      verifyElementCopy(this.crossDeviceSubMessage, documentUploadScreenCrossDeviceStrings.header.submessage)
      this.crossDeviceArrow.isDisplayed()
    }

    async verifyUploaderIcon() {
      this.uploaderIcon.isDisplayed()
    }

    async verifyUploaderButton(copy) {
      const documentUploadScreenStrings = copy.capture
      verifyElementCopy(this.uploaderBtn, documentUploadScreenStrings.upload_file)
    }
    
    async verifyDocumentUploadScreenPassportTitle(copy) {
      const documentUploadScreenStrings = copy.capture
      verifyElementCopy(this.title, documentUploadScreenStrings.passport)
    }

    async verifyDocumentUploadScreenPassportInstructionMessage(copy) {
      const documentUploadScreenStrings = copy.capture
      verifyElementCopy(this.uploaderInstructionsMessage, documentUploadScreenStrings.passport.front.instructions)
    }

    async verifyDocumentUploadScreenFrontOfDrivingLicenceTitle(copy) {
      const documentUploadScreenStrings = copy.capture
      verifyElementCopy(this.title, documentUploadScreenStrings.driving_licence.front.title)
    }

    async verifyDocumentUploadScreenFrontInstructionMessage(copy) {
      const documentUploadScreenStrings = copy.capture
      verifyElementCopy(this.uploaderInstructionsMessage, documentUploadScreenStrings.driving_licence.front.instructions)
    }

    async verifyDocumentUploadScreenBackOfDrivingLicenceTitle(copy) {
      const documentUploadScreenStrings = copy.capture
      verifyElementCopy(this.title, documentUploadScreenStrings.driving_licence.back.title)
    }

    async verifyDocumentUploadScreenBackInstructionMessage(copy) {
      const documentUploadScreenStrings = copy.capture
      verifyElementCopy(this.uploaderInstructionsMessage, documentUploadScreenStrings.driving_licence.back.instructions)
    }

    async verifyDocumentUploadScreenFrontOfIdentityCardTitle(copy) {
      const documentUploadScreenStrings = copy.capture
      verifyElementCopy(this.title, documentUploadScreenStrings.national_identity_card.front.title)
    }

    async verifyDocumentUploadScreenFrontOfIdentityCardInstructionMessage(copy) {
      const documentUploadScreenStrings = copy.capture
      verifyElementCopy(this.uploaderInstructionsMessage, documentUploadScreenStrings.national_identity_card.front.instructions)
    }

    async verifyDocumentUploadScreenBackOfIdentityCardTitle(copy) {
      const documentUploadScreenStrings = copy.capture
      verifyElementCopy(this.title, documentUploadScreenStrings.national_identity_card.back.title)
    }

    async verifyDocumentUploadScreenBackOfIdentityCardInstructionMessage(copy) {
      const documentUploadScreenStrings = copy.capture
      verifyElementCopy(this.uploaderInstructionsMessage, documentUploadScreenStrings.national_identity_card.back.instructions)
    }
}

export default DocumentUpload;