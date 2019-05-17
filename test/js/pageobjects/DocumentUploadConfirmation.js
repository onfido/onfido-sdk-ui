import Base from './BasePage.js'
import {locale} from '../utils/mochaw'

class DocumentUploadConfirmation extends Base{
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
    const checkReadabilityText = documentUpload.title.getText()
    expect(checkReadabilityText).to.equal(documentUploadLocale["confirm"]["document"]["title"])
    title.isDisplayed()
  }

  verifyDocumentUploadScreenMakeSurePassportMessage() {
    const makeSureClearDetailsMessage = documentUploadConfirmation.makeSureClearDetailsMessage.getText()
    expect(makeSureClearDetailsMessage).to.equal(documentUploadLocale["confirm"]["passport"]["message"])
    documentUploadConfirmation.makeSureClearDetailsMessage.isDisplayed()
  }

  verifyDocumentUploadScreenMakeSureDrivingLicenceMessage() {
    const makeSureClearDetailsMessage = documentUploadConfirmation.makeSureClearDetailsMessage.getText()
    expect(makeSureClearDetailsMessage).to.equal(documentUploadConfirmationLocale["confirm"]["driving_licence"]["message"])
    documentUploadConfirmation.makeSureClearDetailsMessage.isDisplayed()
  }

  verifyDocumentUploadScreenMakeSureIdentityCardMessage() {
    const makeSureClearDetailsMessage = documentUploadConfirmation.makeSureClearDetailsMessage.getText()
    expect(makeSureClearDetailsMessage).to.equal(documentUploadConfirmationLocale["confirm"]["national_identity_card"]["message"])
    documentUploadConfirmation.makeSureClearDetailsMessage.isDisplayed()
  }

  verifyNoDocumentError() {
    const errorTitleText = errorTitleText.getText()
    expect(errorTitleText).to.equal(documentUploadConfirmationLocale["errors"]["invalid_capture"]["message"])
    errorTitleText.isDisplayed()
    errorTitleIcon.isDisplayed()
    const errorInstruction = errorInstruction.getText()
    expect(errorInstruction).to.equal(documentUploadConfirmationLocale["errors"]["invalid_capture"]["instruction"])
    errorInstruction.isDisplayed()
  }

  verifyFileSizeTooLargeError() {
    const uploaderError = uploaderError.getText()
    expect(uploaderError).to.equal(documentUploadLocale["errors"]["invalid_size"]["message"] + ". " + documentUploadLocale["errors"]["invalid_size"]["instruction"] + ".")
    uploaderError.isDisplayed()
  }

  verifyUseAnotherFileError() {
    const uploaderError = uploaderError.getText()
      expect(uploaderError).to.equal(documentUploadLocale["errors"]["invalid_type"]["message"] + ". " + documentUploadLocale["errors"]["invalid_type"]["instruction"] + ".")
      uploaderError.isDisplayed()
  }

  verifyUnsuppoertedFileError() {
    const unsupportedFileError = errorTitleText.getText()
    expect(unsupportedFileError).to.equal(documentUploadConfirmationLocale["errors"]["unsupported_file"]["message"])
    errorTitleText.isDisplayed()
    errorTitleIcon.isDisplayed()
    const unsupportedFileInstruction = errorInstruction.getText()
    expect(unsupportedFileInstruction).to.equal(documentUploadConfirmationLocale["errors"]["unsupported_file"]["instruction"])
    errorInstruction.isDisplayed()
  }

  verifyNoFaceError() {
    const noFaceError = documentUploadConfirmation.errorTitleText.getText()
    expect(noFaceError).to.equal(documentUploadConfirmationLocale["errors"]["no_face"]["message"])
    documentUploadConfirmation.errorTitleText.isDisplayed()
    documentUploadConfirmation.errorTitleIcon.isDisplayed()
    const noFaceInstruction = documentUploadConfirmation.errorInstruction.getText()
    expect(noFaceInstruction).to.equal(documentUploadConfirmationLocale["errors"]["no_face"]["instruction"])
    documentUploadConfirmation.errorInstruction.isDisplayed()
  }

  verifyMultipleFacesError() {
    const multipleFacesError = documentUploadConfirmation.errorTitleText.getText()
    expect(multipleFacesError).to.equal(documentUploadConfirmationLocale["errors"]["multiple_faces"]["message"])
    documentUploadConfirmation.errorTitleText.isDisplayed()
    documentUploadConfirmation.errorTitleIcon.isDisplayed()
    const multipleFacesInstruction = documentUploadConfirmation.errorInstruction.getText()
    expect(multipleFacesInstruction).to.equal(documentUploadConfirmationLocale["errors"]["multiple_faces"]["instruction"])
    documentUploadConfirmation.errorInstruction.isDisplayed()
  }

  verifyGlareDetectedWarning() {
    const glareDetectedMessageFront = errorTitleText.getText()
    expect(glareDetectedMessageFront).to.equal(documentUploadConfirmationLocale["errors"]["glare_detected"]["message"])
    errorTitleText.isDisplayed()
    warningTitleIcon.isDisplayed()
    const glareDetectedInstructionFront = errorInstruction.getText()
    expect(glareDetectedInstructionFront).to.equal(documentUploadConfirmationLocale["errors"]["glare_detected"]["instruction"])
    errorInstsruction.isDisplayed()
  }
}

export default DocumentUploadConfirmation;