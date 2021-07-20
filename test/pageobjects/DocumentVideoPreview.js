import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'

class DocumentVideoPreview extends BasePage {
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

  async verifyUploadVideoButtonLabel(copy) {
    verifyElementCopy(
      this.documentVideoUploadButton(),
      copy.video_confirmation.button_primary
    )
  }

  async verifyRetakeVideoButtonLabel(copy) {
    verifyElementCopy(
      this.documentVideoRetakeVideoButton(),
      copy.video_confirmation.button_secondary
    )
  }

  async chooseToRetakeVideo(copy) {
    this.verifyRetakeVideoButtonLabel(copy)
    this.documentVideoRetakeVideoButton().click()
  }

  async checkYourVideoIsSeen(copy) {
    verifyElementCopy(
      this.documentVideoPreviewTitle(),
      copy.doc_video_confirmation.title
    )
    this.documentVideoPreview().isDisplayed()
    this.documentVideoRetakeVideoButton().isDisplayed()
    this.verifyRetakeVideoButtonLabel(copy)
    this.documentVideoUploadButton().isDisplayed()
    this.verifyUploadVideoButtonLabel(copy)
  }

  async uploadDocumentVideo(copy) {
    this.verifyUploadVideoButtonLabel(copy)
    this.documentVideoUploadButton().click()
  }
}

export default DocumentVideoPreview
