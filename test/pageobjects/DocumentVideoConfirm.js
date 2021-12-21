import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'

class DocumentVideoConfirm extends BasePage {
  async documentVideoConfirmIcon() {
    return this.$('.onfido-sdk-ui-DocumentVideo-Confirm-icon')
  }
  async documentVideoConfirmTitle() {
    return this.$('.onfido-sdk-ui-DocumentVideo-Confirm-title')
  }
  async documentVideoConfirmMessage() {
    return this.$('.onfido-sdk-ui-DocumentVideo-Confirm-body')
  }
  async documentVideoUploadButton() {
    return this.$('[data-onfido-qa="doc-video-confirm-primary-btn"]')
  }
  async documentVideoSecondaryButton() {
    return this.$('[data-onfido-qa="doc-video-confirm-secondary-btn"]')
  }
  async spinner() {
    return this.$('.onfido-sdk-ui-Spinner-inner')
  }

  async userIsShownConfirmationDetails(copy) {
    await this.backArrow().isDisplayed()
    await this.documentVideoConfirmIcon().isDisplayed()
    await verifyElementCopy(this.documentVideoConfirmTitle(), copy.outro.body)
    await verifyElementCopy(
      this.documentVideoConfirmMessage(),
      copy.video_confirmation.body
    )
    await this.verifyUploadVideoButtonLabel(copy)
    await this.verifyPreviewVideoButtonLabel(copy)
  }

  async verifyUploadVideoButtonLabel(copy) {
    await verifyElementCopy(
      this.documentVideoUploadButton(),
      copy.video_confirmation.button_primary
    )
  }

  async verifyPreviewVideoButtonLabel(copy) {
    await verifyElementCopy(
      this.documentVideoSecondaryButton(),
      copy.doc_video_confirmation.button_secondary
    )
  }

  async chooseToPreviewVideo(copy) {
    await this.verifyPreviewVideoButtonLabel(copy)
    this.documentVideoSecondaryButton().click()
  }

  async uploadAndWaitForSpinner(copy) {
    await this.verifyUploadVideoButtonLabel(copy)
    this.documentVideoUploadButton().click()
    await this.spinner().isDisplayed()
  }
}

export default DocumentVideoConfirm
