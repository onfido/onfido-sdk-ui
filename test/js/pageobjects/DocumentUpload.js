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
      verifyElementCopy(uploaderBtn, documentUploadLocale["capture"]["upload_file"])
    }

    verifyDocumentUploadScreenPassportInstructionMessage() {
      verifyElementCopy(uploaderInstructionsMessage, documentUploadLocale["capture"]["passport"]["front"]["instructions"])
    }

    verifyDocumentUploadScreenFrontOfDrivingLicenceTitle() {
      verifyElementCopy(title, documentUploadLocale["capture"]["driving_licence"]["front"]["title"])
    }

    verifyDocumentUploadScreenFrontInstructionMessage() {
      verifyElementCopy(uploaderInstructionsMessage, documentUploadLocale["capture"]["driving_licence"]["front"]["instructions"])
    }

    verifyDocumentUploadScreenBackOfDrivingLicenceTitle() {
      verifyElementCopy(title, documentUploadLocale["capture"]["driving_licence"]["back"]["title"])
    }

    verifyDocumentUploadScreenBackInstructionMessage() {
      verifyElementCopy(uploaderInstructionsMessage, documentUploadLocale["capture"]["driving_licence"]["back"]["instructions"])
    }

    verifyDocumentUploadScreenFrontOfIdentityCardTitle() {
      verifyElementCopy(title, documentUploadLocale["capture"]["national_identity_card"]["front"]["title"])
    }

    verifyDocumentUploadScreenFrontOfIdentityCardInstructionMessage() {
      verifyElementCopy(uploaderInstructionsMessage, documentUploadLocale["capture"]["national_identity_card"]["front"]["instructions"])
    }

    verifyDocumentUploadScreenBackOfIdentityCardTitle() {
      verifyElementCopy(title, documentUploadLocale["capture"]["national_identity_card"]["back"]["title"])
    }

    verifyDocumentUploadScreenBackOfIdentityCardInstructionMessage() {
      verifyElementCopy(uploaderInstructionsMessage, documentUploadLocale["capture"]["national_identity_card"]["back"]["instructions"])
    }
}

export default DocumentUpload;