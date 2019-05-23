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

  /* eslint-disable no-undef */
  copy(lang) { return locale(lang) }

  verifyDocumentUploadScreenCheckReadabilityMessage() {
    const documentUploadConfirmationScreenStrings = copy(lang).errors
    verifyElementCopy(title, documentUploadConfirmationScreenStrings.document.title)
  }

  verifyDocumentUploadScreenMakeSurePassportMessage() {
    const documentUploadConfirmationScreenStrings = copy(lang).errors
    verifyElementCopy(makeSureClearDetailsMessage, documentUploadConfirmationScreenStrings.passport.message)
  }

  verifyDocumentUploadScreenMakeSureDrivingLicenceMessage() {
    const documentUploadConfirmationScreenStrings = copy(lang).errors
    verifyElementCopy(makeSureClearDetailsMessage, documentUploadConfirmationScreenStrings.driving_licence.message)
  }

  verifyDocumentUploadScreenMakeSureIdentityCardMessage() {
    const documentUploadConfirmationScreenStrings = copy(lang).errors
    verifyElementCopy(makeSureClearDetailsMessage, documentUploadConfirmationScreenStrings.national_identity_card.message)
  }

  verifyNoDocumentError() {
    const documentUploadConfirmationScreenErrorStrings = copy(lang).errors
    verifyElementCopy(errorTitleText, documentUploadConfirmationScreenErrorStrings.invalid_capture.message)
    errorTitleIcon.isDisplayed()
    verifyElementCopy(errorInstruction, documentUploadConfirmationScreenErrorStrings.invalid_capture.instruction)
  }

  verifyFileSizeTooLargeError() {
    const documentUploadConfirmationScreenErrorStrings = copy(lang).errors
    verifyElementCopy(uploaderError, documentUploadConfirmationScreenErrorStrings.invalid_size.message + ". " + documentUploadConfirmationScreenErrorStrings.invalid_size.instruction + ".")
  }

  verifyUseAnotherFileError() {
    const documentUploadConfirmationScreenErrorStrings = copy(lang).errors
    verifyElementCopy(uploaderError, documentUploadConfirmationScreenErrorStrings.invalid_type.message + ". " + documentUploadConfirmationScreenErrorStrings.invalid_type.instruction + ".")
  }

  verifyUnsuppoertedFileError() {
    const documentUploadConfirmationScreenErrorStrings = copy(lang).errors
    verifyElementCopy(errorTitleText, documentUploadConfirmationScreenErrorStrings.unsupported_file.message)
    errorTitleIcon.isDisplayed()
    verifyElementCopy(errorInstruction, documentUploadConfirmationScreenErrorStrings.unsupported_file.instruction)
  }

  verifyNoFaceError() {
    const documentUploadConfirmationScreenErrorStrings = copy(lang).errors
    verifyElementCopy(errorTitleText, documentUploadConfirmationScreenErrorStrings.no_face.message)
    errorTitleIcon.isDisplayed()
    verifyElementCopy(errorInstruction, documentUploadConfirmationScreenErrorStrings.no_face.instruction)
  }

  verifyMultipleFacesError() {
    const documentUploadConfirmationScreenErrorStrings = copy(lang).errors
    verifyElementCopy(errorTitleText, documentUploadConfirmationScreenErrorStrings.multiple_faces.message)
    errorTitleIcon.isDisplayed()
    verifyElementCopy(errorInstruction, documentUploadConfirmationScreenErrorStrings.multiple_faces.instruction)
  }

  verifyGlareDetectedWarning() {
    const documentUploadConfirmationScreenErrorStrings = copy(lang).errors
    verifyElementCopy(errorTitleText, documentUploadConfirmationScreenErrorStrings.glare_detected.message)
    warningTitleIcon.isDisplayed()
    verifyElementCopy(errorInstruction, documentUploadConfirmationScreenErrorStrings.glare_detected.instruction)
  }
}

export default DocumentUploadConfirmation;