import Base from './BasePage.js'
import { locale, verifyElementCopy } from '../utils/mochaw'
//TODO: this class is wrongly named. This class handle elements for both selfie and document confirmatin
class DocumentUploadConfirmation extends Base {
  get title() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
  get makeSureClearDetailsMessage() { return this.$('.onfido-sdk-ui-PageTitle-subTitle')}
  get redoBtn() { return this.$('.onfido-sdk-ui-Confirm-retake')}
  get confirmBtn() { return this.$('.onfido-sdk-ui-Confirm-btn-primary')}
  get uploaderError() { return this.$('.onfido-sdk-ui-Uploader-error')}
  get errorTitleText() { return this.$('.onfido-sdk-ui-Error-title-text')}
  get errorTitleIcon() { return this.$('.onfido-sdk-ui-Error-title-icon-error')}
  get warningTitleIcon() { return this.$('.onfido-sdk-ui-Error-title-icon-warning')}
  get errorInstruction() { return this.$('.onfido-sdk-ui-Error-instruction-text')}
  get shutterButton() { return this.$('.onfido-sdk-ui-Photo-btn')}


  copy(lang) { return locale(lang) }

  async verifyCheckReadabilityMessage(copy) {
    const documentUploadConfirmationStrings = copy.confirm
    verifyElementCopy(this.title, documentUploadConfirmationStrings.document.title)
  }

  async verifyMakeSurePassportMessage(copy) {
    const documentUploadConfirmationStrings = copy.confirm
    verifyElementCopy(this.makeSureClearDetailsMessage, documentUploadConfirmationStrings.passport.message)
  }

  async verifyMakeSureDrivingLicenceMessage(copy) {
    const documentUploadConfirmationStrings = copy.confirm
    verifyElementCopy(this.makeSureClearDetailsMessage, documentUploadConfirmationStrings.driving_licence.message)
  }

  async verifyMakeSureIdentityCardMessage(copy) {
    const documentUploadConfirmationStrings = copy.confirm
    verifyElementCopy(this.makeSureClearDetailsMessage, documentUploadConfirmationStrings.national_identity_card.message)
  }

  async verifyNoDocumentError(copy) {
    const documentUploadConfirmationErrorStrings = copy.errors
    verifyElementCopy(this.errorTitleText, documentUploadConfirmationErrorStrings.invalid_capture.message)
    this.errorTitleIcon.isDisplayed()
    verifyElementCopy(this.errorInstruction, documentUploadConfirmationErrorStrings.invalid_capture.instruction)
  }

  async verifyFileSizeTooLargeError(copy) {
    const documentUploadConfirmationErrorStrings = copy.errors
    verifyElementCopy(this.uploaderError, documentUploadConfirmationErrorStrings.invalid_size.message + ". " + documentUploadConfirmationErrorStrings.invalid_size.instruction + ".")
  }

  async verifyUseAnotherFileError(copy) {
    const documentUploadConfirmationErrorStrings = copy.errors
    verifyElementCopy(this.uploaderError, documentUploadConfirmationErrorStrings.invalid_type.message + ". " + documentUploadConfirmationErrorStrings.invalid_type.instruction + ".")
  }

  async verifyUnsuppoertedFileError(copy) {
    const documentUploadConfirmationErrorStrings = copy.errors
    verifyElementCopy(this.errorTitleText, documentUploadConfirmationErrorStrings.unsupported_file.message)
    this.errorTitleIcon.isDisplayed()
    verifyElementCopy(this.errorInstruction, documentUploadConfirmationErrorStrings.unsupported_file.instruction)
  }

  async verifyNoFaceError(copy) {
    const documentUploadConfirmationErrorStrings = copy.errors
    verifyElementCopy(this.errorTitleText, documentUploadConfirmationErrorStrings.no_face.message)
    this.errorTitleIcon.isDisplayed()
    verifyElementCopy(this.errorInstruction, documentUploadConfirmationErrorStrings.no_face.instruction)
  }

  async verifyMultipleFacesError(copy) {
    const documentUploadConfirmationErrorStrings = copy.errors
    verifyElementCopy(this.errorTitleText, documentUploadConfirmationErrorStrings.multiple_faces.message)
    this.errorTitleIcon.isDisplayed()
    verifyElementCopy(this.errorInstruction, documentUploadConfirmationErrorStrings.multiple_faces.instruction)
  }

  async verifyGlareDetectedWarning(copy) {
    const documentUploadConfirmationErrorStrings = copy.errors
    verifyElementCopy(this.errorTitleText, documentUploadConfirmationErrorStrings.glare_detected.message)
    this.warningTitleIcon.isDisplayed()
    verifyElementCopy(this.errorInstruction, documentUploadConfirmationErrorStrings.glare_detected.instruction)
  }

  // TODO: this function is never called!
  async clickOnConfirmButton() {
    this.confirmBtn.click()
  }

  async takeSelfie() {
    this.driver.sleep(1000)
    this.shutterButton.click()
  }
}

export default DocumentUploadConfirmation
