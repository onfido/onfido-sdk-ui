import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'

class DocumentVideoPreview extends BasePage {
  async errorTitleText() {
    return this.$('.onfido-sdk-ui-Error-title-text')
  }
  async errorInstructionText() {
    return this.$('.onfido-sdk-ui-Error-instruction-text')
  }
  async documentVideoPreviewTitle() {
    return this.$('.onfido-sdk-ui-DocumentVideo-Confirm-title')
  }
  async documentVideoUploadButton() {
    return this.$('[data-onfido-qa="doc-video-confirm-primary-btn"]')
  }
  async documentVideoRetakeVideoButton() {
    return this.$('[data-onfido-qa="doc-video-confirm-secondary-btn"]')
  }
  async documentVideoPreview() {
    return this.$('.onfido-sdk-ui-CaptureViewer-video')
  }
  async spinner() {
    return this.$('.onfido-sdk-ui-Spinner-inner')
  }

  async uploadVideoButton(copy) {
    verifyElementCopy(
      this.documentVideoUploadButton(),
      copy.video_confirmation.button_primary
    )
  }

  async retakeVideoButton(copy) {
    verifyElementCopy(
      this.documentVideoRetakeVideoButton(),
      copy.video_confirmation.button_secondary
    )
  }

  async chooseToRetakeVideo(copy) {
    this.retakeVideoButton(copy)
    this.documentVideoRetakeVideoButton().click()
  }

  async checkYourVideoIsSeen(copy) {
    verifyElementCopy(
      this.documentVideoPreviewTitle(),
      copy.doc_video_confirmation.title
    )
    this.documentVideoPreview().isDisplayed()
    this.documentVideoRetakeVideoButton().isDisplayed()
    this.retakeVideoButton(copy)
    this.documentVideoUploadButton().isDisplayed()
    this.uploadVideoButton(copy)
  }

  async userChoosesToUpload(copy) {
    this.uploadVideoButton(copy)
    this.documentVideoUploadButton().click()
  }

  async userIsShownConnectionLostError(copy) {
    verifyElementCopy(
      this.errorTitleText(),
      copy.generic.errors.request_error.message
    )
    verifyElementCopy(
      this.errorInstructionText(),
      copy.generic.errors.request_error.instruction
    )
  }
}

export default DocumentVideoPreview
