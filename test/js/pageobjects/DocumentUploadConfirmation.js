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

  verifyDocumentUploadScreenCheckReadabilityMessage(copy) {
    const documentUploadConfirmationScreenStrings = copy.errors
    verifyElementCopy(this.title, documentUploadConfirmationScreenStrings.document.title)
  }

  verifyDocumentUploadScreenMakeSurePassportMessage(copy) {
    const documentUploadConfirmationScreenStrings = copy.errors
    tverifyElementCopy(this.makeSureClearDetailsMessage, documentUploadConfirmationScreenStrings.passport.message)
  }

  verifyDocumentUploadScreenMakeSureDrivingLicenceMessage(copy) {
    const documentUploadConfirmationScreenStrings = copy.errors
    verifyElementCopy(this.makeSureClearDetailsMessage, documentUploadConfirmationScreenStrings.driving_licence.message)
  }

  verifyDocumentUploadScreenMakeSureIdentityCardMessage(copy) {
    const documentUploadConfirmationScreenStrings = copy.errors
    verifyElementCopy(this.makeSureClearDetailsMessage, documentUploadConfirmationScreenStrings.national_identity_card.message)
  }

  verifyNoDocumentError(copy) {
    const documentUploadConfirmationScreenErrorStrings = copy.errors
    verifyElementCopy(this.errorTitleText, documentUploadConfirmationScreenErrorStrings.invalid_capture.message)
    verifyElementCopy(this.errorTitleIcon)
    verifyElementCopy(this.errorInstruction, documentUploadConfirmationScreenErrorStrings.invalid_capture.instruction)
  }

  verifyFileSizeTooLargeError(copy) {
    const documentUploadConfirmationScreenErrorStrings = copy.errors
    verifyElementCopy(this.uploaderError, documentUploadConfirmationScreenErrorStrings.invalid_size.message + ". " + documentUploadConfirmationScreenErrorStrings.invalid_size.instruction + ".")
  }

  verifyUseAnotherFileError(copy) {
    const documentUploadConfirmationScreenErrorStrings = copy.errors
    verifyElementCopy(this.uploaderError, documentUploadConfirmationScreenErrorStrings.invalid_type.message + ". " + documentUploadConfirmationScreenErrorStrings.invalid_type.instruction + ".")
  }

  verifyUnsuppoertedFileError(copy) {
    const documentUploadConfirmationScreenErrorStrings = copy.errors
    verifyElementCopy(this.errorTitleText, documentUploadConfirmationScreenErrorStrings.unsupported_file.message)
    verifyElementCopy(this.errorTitleIcon)
    verifyElementCopy(this.errorInstruction, documentUploadConfirmationScreenErrorStrings.unsupported_file.instruction)
  }

  verifyNoFaceError(copy) {
    const documentUploadConfirmationScreenErrorStrings = copy.errors
    verifyElementCopy(this.errorTitleText, documentUploadConfirmationScreenErrorStrings.no_face.message)
    verifyElementCopy(this.errorTitleIcon)
    verifyElementCopy(this.errorInstruction, documentUploadConfirmationScreenErrorStrings.no_face.instruction)
  }

  verifyMultipleFacesError(copy) {
    const documentUploadConfirmationScreenErrorStrings = copy.errors
    verifyElementCopy(this.errorTitleText, documentUploadConfirmationScreenErrorStrings.multiple_faces.message)
    verifyElementCopy(this.errorTitleIcon)
    verifyElementCopy(this.errorInstruction, documentUploadConfirmationScreenErrorStrings.multiple_faces.instruction)
  }

  verifyGlareDetectedWarning(copy) {
    const documentUploadConfirmationScreenErrorStrings = copy.errors
    verifyElementCopy(this.errorTitleText, documentUploadConfirmationScreenErrorStrings.glare_detected.message)
    verifyElementCopy(this.errorTitleIcon)
    verifyElementCopy(this.errorInstruction, documentUploadConfirmationScreenErrorStrings.glare_detected.instruction)
  }
}

export default DocumentUploadConfirmation;