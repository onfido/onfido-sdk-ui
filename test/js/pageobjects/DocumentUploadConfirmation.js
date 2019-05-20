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
    verifyElementCopy(title, documentUploadLocale["confirm"]["document"]["title"])
  }

  verifyDocumentUploadScreenMakeSurePassportMessage() {
    verifyElementCopy(makeSureClearDetailsMessage, documentUploadLocale["confirm"]["passport"]["message"])
  }

  verifyDocumentUploadScreenMakeSureDrivingLicenceMessage() {
    verifyElementCopy(makeSureClearDetailsMessage, documentUploadConfirmationLocale["confirm"]["driving_licence"]["message"])
  }

  verifyDocumentUploadScreenMakeSureIdentityCardMessage() {
    verifyElementCopy(makeSureClearDetailsMessage, documentUploadConfirmationLocale["confirm"]["national_identity_card"]["message"])
  }

  verifyNoDocumentError() {
    verifyElementCopy(errorTitleText, documentUploadConfirmationLocale["errors"]["invalid_capture"]["message"])
    errorTitleIcon.isDisplayed()
    verifyElementCopy(errorInstruction, documentUploadConfirmationLocale["errors"]["invalid_capture"]["instruction"])
  }

  verifyFileSizeTooLargeError() {
    verifyElementCopy(uploaderError, documentUploadLocale["errors"]["invalid_size"]["message"] + ". " + documentUploadLocale["errors"]["invalid_size"]["instruction"] + ".")
  }

  verifyUseAnotherFileError() {
    verifyElementCopy(uploaderError, documentUploadLocale["errors"]["invalid_type"]["message"] + ". " + documentUploadLocale["errors"]["invalid_type"]["instruction"] + ".")
  }

  verifyUnsuppoertedFileError() {
    verifyElementCopy(errorTitleText, documentUploadConfirmationLocale["errors"]["unsupported_file"]["message"])
    errorTitleIcon.isDisplayed()
    verifyElementCopy(errorInstruction, ddocumentUploadConfirmationLocale["errors"]["unsupported_file"]["instruction"])
  }

  verifyNoFaceError() {
    verifyElementCopy(errorTitleText, documentUploadConfirmationLocale["errors"]["no_face"]["message"])
    errorTitleIcon.isDisplayed()
    verifyElementCopy(errorInstruction, documentUploadConfirmationLocale["errors"]["no_face"]["instruction"])
  }

  verifyMultipleFacesError() {
    verifyElementCopy(errorTitleText, documentUploadConfirmationLocale["errors"]["multiple_faces"]["message"])
    errorTitleIcon.isDisplayed()
    verifyElementCopy(errorInstruction, documentUploadConfirmationLocale["errors"]["multiple_faces"]["instruction"])
  }

  verifyGlareDetectedWarning() {
    verifyElementCopy(errorTitleText, documentUploadConfirmationLocale["errors"]["glare_detected"]["message"])
    warningTitleIcon.isDisplayed()
    verifyElementCopy(errorInstruction, documentUploadConfirmationLocale["errors"]["glare_detected"]["instruction"])
  }
}

export default DocumentUploadConfirmation;