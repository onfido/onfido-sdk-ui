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
    await verifyElementCopy(
      this.documentVideoUploadButton(),
      copy.video_confirmation.button_primary
    )
  }

  async verifyRetakeVideoButtonLabel(copy) {
    await verifyElementCopy(
      this.documentVideoRetakeVideoButton(),
      copy.video_confirmation.button_secondary
    )
  }

  async chooseToRetakeVideo(copy) {
    await this.verifyRetakeVideoButtonLabel(copy)
    this.documentVideoRetakeVideoButton().click()
  }

  async checkYourVideoIsSeen(copy) {
    await verifyElementCopy(
      this.documentVideoPreviewTitle(),
      copy.doc_video_confirmation.title
    )
    await this.documentVideoPreview().isDisplayed()
    await this.documentVideoRetakeVideoButton().isDisplayed()
    await this.verifyRetakeVideoButtonLabel(copy)
    await this.documentVideoUploadButton().isDisplayed()
    await this.verifyUploadVideoButtonLabel(copy)
  }

  async uploadDocumentVideo(copy) {
    await this.verifyUploadVideoButtonLabel(copy)
    this.documentVideoUploadButton().click()
  }
}

export default DocumentVideoPreview
