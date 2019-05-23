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

    /* eslint-disable no-undef */
    copy(lang) { return locale(lang) }

    verifyCrossDeviceUIElements() {
      const documentUploadScreenCrossDeviceStrings = copy(lang).cross_device.switch_device
      crossDeviceIcon.isDisplayed()
      verifyElementCopy(crossDeviceHeader, documentUploadScreenCrossDeviceStrings.header)
      verifyElementCopy(crossDeviceSubMessage, documentUploadScreenCrossDeviceStrings.header.submessage)
      crossDeviceArrow.isDisplayed()
    }

    verifyUploaderIcon() {
      uploaderIcon.isDisplayed()
    }

    verifyUploaderButton() {
      const documentUploadScreenStrings = copy(lang).capture
      verifyElementCopy(uploaderBtn, documentUploadScreenStrings.upload_file)
    }

    verifyDocumentUploadScreenPassportInstructionMessage() {
      const documentUploadScreenStrings = copy(lang).capture
      verifyElementCopy(uploaderInstructionsMessage, documentUploadScreenStrings.passport.front.instructions)
    }

    verifyDocumentUploadScreenFrontOfDrivingLicenceTitle() {
      const documentUploadScreenStrings = copy(lang).capture
      verifyElementCopy(title, documentUploadScreenStrings.driving_licence.front.title)
    }

    verifyDocumentUploadScreenFrontInstructionMessage() {
      const documentUploadScreenStrings = copy(lang).capture
      verifyElementCopy(uploaderInstructionsMessage, documentUploadScreenStrings.driving_licence.front.instructions)
    }

    verifyDocumentUploadScreenBackOfDrivingLicenceTitle() {
      const documentUploadScreenStrings = copy(lang).capture
      verifyElementCopy(title, documentUploadScreenStrings.driving_licence.back.title)
    }

    verifyDocumentUploadScreenBackInstructionMessage() {
      const documentUploadScreenStrings = copy(lang).capture
      verifyElementCopy(uploaderInstructionsMessage, documentUploadScreenStrings.driving_licence.back.instructions)
    }

    verifyDocumentUploadScreenFrontOfIdentityCardTitle() {
      const documentUploadScreenStrings = copy(lang).capture
      verifyElementCopy(title, documentUploadScreenStrings.national_identity_card.front.title)
    }

    verifyDocumentUploadScreenFrontOfIdentityCardInstructionMessage() {
      const documentUploadScreenStrings = copy(lang).capture
      verifyElementCopy(uploaderInstructionsMessage, documentUploadScreenStrings.national_identity_card.front.instructions)
    }

    verifyDocumentUploadScreenBackOfIdentityCardTitle() {
      const documentUploadScreenStrings = copy(lang).capture
      verifyElementCopy(title, documentUploadScreenStrings.national_identity_card.back.title)
    }

    verifyDocumentUploadScreenBackOfIdentityCardInstructionMessage() {
      const documentUploadScreenStrings = copy(lang).capture
      verifyElementCopy(uploaderInstructionsMessage, documentUploadScreenStrings.national_identity_card.back.instructions)
    }
}

export default DocumentUpload;