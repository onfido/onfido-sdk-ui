import Base from './BasePage.js'
const path = require('path')
const locale = (lang="en") => require(`../../../src/locales/${lang}.json`)

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
      const crossDeviceHeaderText = crossDeviceHeader.getText()
      expect(crossDeviceHeaderText).to.equal(documentUploadScreenCrossDeviceStrings.header)
      crossDeviceHeader.isDisplayed()
      const crossDeviceSubMessageText = crossDeviceSubMessage.getText()
      expect(crossDeviceSubMessageText).to.equal(documentUploadScreenCrossDeviceStrings.header.submessage)
      crossDeviceSubMessage.isDisplayed()
      crossDeviceArrow.isDisplayed()
    }

    verifyUploaderIcon() {
      uploaderIcon.isDisplayed()
    }

    verifyUploaderButton() {
      const uploaderBtnText = uploaderBtn.getText()
      expect(uploaderBtnText).to.equal(documentUploadLocale["capture"]["upload_file"])
      uploaderBtn.isDisplayed()
    }

    verifyDocumentUploadScreenPassportInstructionMessage() {
      const passportInstructionMessage = uploaderInstructionsMessage.getText()
      expect(passportInstructionMessage).to.equal(documentUploadLocale["capture"]["passport"]["front"]["instructions"])
      uploaderInstructionsMessage.isDisplayed()
    }

    verifyDocumentUploadScreenFrontOfDrivingLicenceTitle() {
      const frontOfDrivingLicenceTitle = title.getText()
      expect(frontOfDrivingLicenceTitle).to.equal(documentUploadLocale["capture"]["driving_licence"]["front"]["title"])
      title.isDisplayed()
    }

    verifyDocumentUploadScreenFrontInstructionMessage() {
      const frontOfDrivingLicenceInstructionMessage = uploaderInstructionsMessage.getText()
      expect(frontOfDrivingLicenceInstructionMessage).to.equal(documentUploadLocale["capture"]["driving_licence"]["front"]["instructions"])
      uploaderInstructionsMessage.isDisplayed()
    }

    verifyDocumentUploadScreenBackOfDrivingLicenceTitle() {
      const backOfDrivingLicenceTitle = title.getText()
      expect(backOfDrivingLicenceTitle).to.equal(documentUploadLocale["capture"]["driving_licence"]["back"]["title"])
      title.isDisplayed()
    }

    verifyDocumentUploadScreenBackInstructionMessage() {
      const backOfDrivingLicenceInstructionMessage = uploaderInstructionsMessage.getText()
      expect(backOfDrivingLicenceInstructionMessage).to.equal(documentUploadLocale["capture"]["driving_licence"]["back"]["instructions"])
      uploaderInstructionsMessage.isDisplayed()
    }

    verifyDocumentUploadScreenFrontOfIdentityCardTitle() {
      const frontOfIdentityCardTitle = title.getText()
      expect(frontOfIdentityCardTitle).to.equal(documentUploadLocale["capture"]["national_identity_card"]["front"]["title"])
      title.isDisplayed()
    }

    verifyDocumentUploadScreenFrontOfIdentityCardInstructionMessage() {
      const frontOfIdentityCardInstructionMessage = uploaderInstructionsMessage.getText()
      expect(frontOfIdentityCardInstructionMessage).to.equal(documentUploadLocale["capture"]["national_identity_card"]["front"]["instructions"])
      uploaderInstructionsMessage.isDisplayed()
    }

    verifyDocumentUploadScreenBackOfIdentityCardTitle() {
      const backOfIdentityCardTitle = title.getText()
      expect(backOfIdentityCardTitle).to.equal(documentUploadLocale["capture"]["national_identity_card"]["back"]["title"])
      title.isDisplayed()
    }

    verifyDocumentUploadScreenBackOfIdentityCardInstructionMessage() {
      const backOfIdentityCardInstructionMessage = documentUpload.uploaderInstructionsMessage.getText()
      expect(backOfIdentityCardInstructionMessage).to.equal(documentUploadLocale["capture"]["national_identity_card"]["back"]["instructions"])
      documentUpload.uploaderInstructionsMessage.isDisplayed()
    }
}

export default DocumentUpload;