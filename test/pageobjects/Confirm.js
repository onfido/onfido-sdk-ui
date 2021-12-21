import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'

class Confirm extends BasePage {
  async message() {
    return this.$('.onfido-sdk-ui-Confirm-message')
  }
  async redoBtn() {
    return this.$('[data-onfido-qa="redo-action-btn"]')
  }
  async confirmBtn() {
    return this.$('[data-onfido-qa="confirm-action-btn"]')
  }
  async uploaderError() {
    return this.$('.onfido-sdk-ui-Uploader-error')
  }
  async errorTitleText() {
    return this.$('.onfido-sdk-ui-Error-title-text')
  }
  async errorTitleIcon() {
    return this.$('.onfido-sdk-ui-Error-title-icon-error')
  }
  async warningTitleIcon() {
    return this.$('.onfido-sdk-ui-Error-title-icon-warning')
  }
  async errorInstruction() {
    return this.$('.onfido-sdk-ui-Error-instruction-text')
  }
  async uploadedVideo() {
    return this.$('.onfido-sdk-ui-CaptureViewer-video')
  }

  async verifyCheckReadabilityMessage(copy) {
    await verifyElementCopy(this.title(), copy.doc_confirmation.title)
  }

  async verifyMakeSurePassportMessage(copy) {
    await verifyElementCopy(this.message(), copy.doc_confirmation.body_passport)
  }

  async verifyMakeSureDrivingLicenceMessage(copy) {
    await verifyElementCopy(this.message(), copy.doc_confirmation.body_license)
  }

  async verifyMakeSureIdentityCardMessage(copy) {
    await verifyElementCopy(this.message(), copy.doc_confirmation.body_id)
  }

  async verifyMakeSureResidencePermitMessage(copy) {
    await verifyElementCopy(this.message(), copy.doc_confirmation.body_permit)
  }

  async verifyNoDocumentError(copy) {
    await verifyElementCopy(
      this.errorTitleText(),
      copy.doc_confirmation.alert.no_doc_title
    )
    await this.errorTitleIcon().isDisplayed()
    await verifyElementCopy(
      this.errorInstruction(),
      copy.doc_confirmation.alert.no_doc_detail
    )
  }

  async verifyFileSizeTooLargeError(copy) {
    await verifyElementCopy(
      this.uploaderError(),
      `${copy.generic.errors.invalid_size.message} ${copy.generic.errors.invalid_size.instruction}`
    )
  }

  async verifyUseAnotherFileError(copy) {
    await verifyElementCopy(
      this.uploaderError(),
      `${copy.generic.errors.invalid_type.message} ${copy.generic.errors.invalid_type.instruction}`
    )
  }

  async verifyUnsuppoertedFileError(copy) {
    await verifyElementCopy(
      this.errorTitleText(),
      copy.generic.errors.unsupported_file.message
    )
    await this.errorTitleIcon().isDisplayed()
    await verifyElementCopy(
      this.errorInstruction(),
      copy.generic.errors.unsupported_file.instruction
    )
  }

  async verifyNoFaceError(copy) {
    await verifyElementCopy(
      this.errorTitleText(),
      copy.generic.errors.no_face.message
    )
    await this.errorTitleIcon().isDisplayed()
    await verifyElementCopy(
      this.errorInstruction(),
      copy.generic.errors.no_face.instruction
    )
  }

  async verifyMultipleFacesError(copy) {
    await verifyElementCopy(
      this.errorTitleText(),
      copy.generic.errors.multiple_faces.message
    )
    await this.errorTitleIcon().isDisplayed()
    await verifyElementCopy(
      this.errorInstruction(),
      copy.generic.errors.multiple_faces.instruction
    )
  }

  async verifyImageQualityMessage(copy, reason, errorType = 'warning') {
    console.assert(
      ['cut-off', 'glare', 'blur'].includes(reason),
      `Reason must be one of 'cut-off', 'glare' or 'blur'`
    )

    const errorsMap = {
      'cut-off': {
        title: copy.doc_confirmation.alert.crop_title,
        detail: copy.doc_confirmation.alert.crop_detail,
      },
      glare: {
        title: copy.doc_confirmation.alert.glare_title,
        detail: copy.doc_confirmation.alert.glare_detail,
      },
      blur: {
        title: copy.doc_confirmation.alert.blur_title,
        detail: copy.doc_confirmation.alert.blur_detail,
      },
    }

    const { [reason]: error } = errorsMap
    await verifyElementCopy(this.errorTitleText(), error.title)
    await verifyElementCopy(this.errorInstruction(), error.detail)

    errorType === 'warning'
      ? await this.warningTitleIcon().isDisplayed()
      : await this.errorTitleIcon().isDisplayed()
  }

  async playVideoBeforeConfirm() {
    await this.uploadedVideo().isDisplayed()
    this.driver.executeScript('arguments[0].play();', this.uploadedVideo())
  }

  async clickConfirmButton() {
    this.confirmBtn().click()
  }

  async clickRedoButton() {
    this.redoBtn().click()
  }
}

export default Confirm
