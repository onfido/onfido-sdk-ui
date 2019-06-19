import Base from './BasePage.js'
import {locale, verifyElementCopy} from '../utils/mochaw'

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

  async verifyDocumentUploadScreenCheckReadabilityMessage(copy) {
    const documentUploadConfirmationScreenStrings = copy.confirm
    verifyElementCopy(this.title, documentUploadConfirmationScreenStrings.document.title)
  }

  async verifyDocumentUploadScreenMakeSurePassportMessage(copy) {
    const documentUploadConfirmationScreenStrings = copy.confirm
    verifyElementCopy(this.makeSureClearDetailsMessage, documentUploadConfirmationScreenStrings.passport.message)
  }

  async verifyDocumentUploadScreenMakeSureDrivingLicenceMessage(copy) {
    const documentUploadConfirmationScreenStrings = copy.confirm
    verifyElementCopy(this.makeSureClearDetailsMessage, documentUploadConfirmationScreenStrings.driving_licence.message)
  }

  async verifyDocumentUploadScreenMakeSureIdentityCardMessage(copy) {
    const documentUploadConfirmationScreenStrings = copy.confirm
    verifyElementCopy(this.makeSureClearDetailsMessage, documentUploadConfirmationScreenStrings.national_identity_card.message)
  }

  async verifyNoDocumentError(copy) {
    const documentUploadConfirmationScreenErrorStrings = copy.errors
    verifyElementCopy(this.errorTitleText, documentUploadConfirmationScreenErrorStrings.invalid_capture.message)
    this.errorTitleIcon.isDisplayed()
    verifyElementCopy(this.errorInstruction, documentUploadConfirmationScreenErrorStrings.invalid_capture.instruction)
  }

  async verifyFileSizeTooLargeError(copy) {
    const documentUploadConfirmationScreenErrorStrings = copy.errors
    verifyElementCopy(this.uploaderError, documentUploadConfirmationScreenErrorStrings.invalid_size.message + ". " + documentUploadConfirmationScreenErrorStrings.invalid_size.instruction + ".")
  }

  async verifyUseAnotherFileError(copy) {
    const documentUploadConfirmationScreenErrorStrings = copy.errors
    verifyElementCopy(this.uploaderError, documentUploadConfirmationScreenErrorStrings.invalid_type.message + ". " + documentUploadConfirmationScreenErrorStrings.invalid_type.instruction + ".")
  }

  async verifyUnsuppoertedFileError(copy) {
    const documentUploadConfirmationScreenErrorStrings = copy.errors
    verifyElementCopy(this.errorTitleText, documentUploadConfirmationScreenErrorStrings.unsupported_file.message)
    this.errorTitleIcon.isDisplayed()
    verifyElementCopy(this.errorInstruction, documentUploadConfirmationScreenErrorStrings.unsupported_file.instruction)
  }

  async verifyNoFaceError(copy) {
    const documentUploadConfirmationScreenErrorStrings = copy.errors
    verifyElementCopy(this.errorTitleText, documentUploadConfirmationScreenErrorStrings.no_face.message)
    this.errorTitleIcon.isDisplayed()
    verifyElementCopy(this.errorInstruction, documentUploadConfirmationScreenErrorStrings.no_face.instruction)
  }

  async verifyMultipleFacesError(copy) {
    const documentUploadConfirmationScreenErrorStrings = copy.errors
    verifyElementCopy(this.errorTitleText, documentUploadConfirmationScreenErrorStrings.multiple_faces.message)
    this.errorTitleIcon.isDisplayed()
    verifyElementCopy(this.errorInstruction, documentUploadConfirmationScreenErrorStrings.multiple_faces.instruction)
  }

  async verifyGlareDetectedWarning(copy) {
    const documentUploadConfirmationScreenErrorStrings = copy.errors
    verifyElementCopy(this.errorTitleText, documentUploadConfirmationScreenErrorStrings.glare_detected.message)
    this.warningTitleIcon.isDisplayed()
    verifyElementCopy(this.errorInstruction, documentUploadConfirmationScreenErrorStrings.glare_detected.instruction)
  }
}

export default DocumentUploadConfirmation;