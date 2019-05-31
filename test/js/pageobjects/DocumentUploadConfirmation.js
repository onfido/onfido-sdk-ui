import Base from './BasePage.js'
import {locale} from '../utils/mochaw'

class DocumentUploadConfirmation extends Base{
  get title() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
  get makeSureClearDetailsMessage() { return this.$('.onfido-sdk-ui-PageTitle-titleWrapper > div:nth-child(2)')}
  get redoBtn() { return this.$('.onfido-sdk-ui-Confirm-retake')}
  get confirmBtn() { return this.$('.onfido-sdk-ui-Confirm-btn-primary')}
  get errorTitleText() { return this.$('.onfido-sdk-ui-Error-title-text')}
  get errorTitleIcon() { return this.$('.onfido-sdk-ui-Error-title-icon-error')}
  get warningTitleIcon() { return this.$('.onfido-sdk-ui-Error-title-icon-warning')}
  get errorInstruction() { return this.$('.onfido-sdk-ui-Error-instruction-text')}

  copy(lang) { return locale(lang) }

  verifyDocumentUploadScreenCheckReadabilityMessage() {
    const documentUploadConfirmationScreenStrings = this.copy(this.lang).errors
    this.verifyElementCopy(this.title, documentUploadConfirmationScreenStrings.document.title)
  }

  verifyDocumentUploadScreenMakeSurePassportMessage() {
    const documentUploadConfirmationScreenStrings = this.copy(this.lang).errors
    this.verifyElementCopy(this.makeSureClearDetailsMessage, documentUploadConfirmationScreenStrings.passport.message)
  }

  verifyDocumentUploadScreenMakeSureDrivingLicenceMessage() {
    const documentUploadConfirmationScreenStrings = this.copy(this.lang).errors
    this.verifyElementCopy(this.makeSureClearDetailsMessage, documentUploadConfirmationScreenStrings.driving_licence.message)
  }

  verifyDocumentUploadScreenMakeSureIdentityCardMessage() {
    const documentUploadConfirmationScreenStrings = this.copy(this.lang).errors
    this.verifyElementCopy(this.makeSureClearDetailsMessage, documentUploadConfirmationScreenStrings.national_identity_card.message)
  }

  verifyNoDocumentError() {
    const documentUploadConfirmationScreenErrorStrings = this.copy(this.lang).errors
    this.verifyElementCopy(this.errorTitleText, documentUploadConfirmationScreenErrorStrings.invalid_capture.message)
    this.errorTitleIcon.isDisplayed()
    this.verifyElementCopy(this.errorInstruction, documentUploadConfirmationScreenErrorStrings.invalid_capture.instruction)
  }

  verifyFileSizeTooLargeError() {
    const documentUploadConfirmationScreenErrorStrings = this.copy(this.lang).errors
    this.verifyElementCopy(this.uploaderError, documentUploadConfirmationScreenErrorStrings.invalid_size.message + ". " + documentUploadConfirmationScreenErrorStrings.invalid_size.instruction + ".")
  }

  verifyUseAnotherFileError() {
    const documentUploadConfirmationScreenErrorStrings = this.copy(this.lang).errors
    this.verifyElementCopy(this.uploaderError, documentUploadConfirmationScreenErrorStrings.invalid_type.message + ". " + documentUploadConfirmationScreenErrorStrings.invalid_type.instruction + ".")
  }

  verifyUnsuppoertedFileError() {
    const documentUploadConfirmationScreenErrorStrings = this.copy(this.lang).errors
    this.verifyElementCopy(this.errorTitleText, documentUploadConfirmationScreenErrorStrings.unsupported_file.message)
    this.errorTitleIcon.isDisplayed()
    this.verifyElementCopy(this.errorInstruction, documentUploadConfirmationScreenErrorStrings.unsupported_file.instruction)
  }

  verifyNoFaceError() {
    const documentUploadConfirmationScreenErrorStrings = this.copy(this.lang).errors
    this.verifyElementCopy(this.errorTitleText, documentUploadConfirmationScreenErrorStrings.no_face.message)
    this.errorTitleIcon.isDisplayed()
    this.verifyElementCopy(this.errorInstruction, documentUploadConfirmationScreenErrorStrings.no_face.instruction)
  }

  verifyMultipleFacesError() {
    const documentUploadConfirmationScreenErrorStrings = this.copy(this.lang).errors
    this.verifyElementCopy(this.errorTitleText, documentUploadConfirmationScreenErrorStrings.multiple_faces.message)
    this.errorTitleIcon.isDisplayed()
    this.verifyElementCopy(this.errorInstruction, documentUploadConfirmationScreenErrorStrings.multiple_faces.instruction)
  }

  verifyGlareDetectedWarning() {
    const documentUploadConfirmationScreenErrorStrings = this.copy(this.lang).errors
    this.verifyElementCopy(this.errorTitleText, documentUploadConfirmationScreenErrorStrings.glare_detected.message)
    this.warningTitleIcon.isDisplayed()
    this.verifyElementCopy(this.errorInstruction, documentUploadConfirmationScreenErrorStrings.glare_detected.instruction)
  }
}

export default DocumentUploadConfirmation;