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
    return this.$(
      '.onfido-sdk-ui-DocumentVideo-Confirm-content > span:nth-child(3)'
    )
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
    this.backArrow().isDisplayed()
    this.documentVideoConfirmIcon().isDisplayed()
    verifyElementCopy(this.documentVideoConfirmTitle(), copy.outro.body)
    verifyElementCopy(
      this.documentVideoConfirmMessage(),
      copy.video_confirmation.body
    )
    this.uploadVideoButton(copy)
    this.previewVideoButton(copy)
  }

  async uploadVideoButton(copy) {
    verifyElementCopy(
      this.documentVideoUploadButton(),
      copy.video_confirmation.button_primary
    )
  }

  async previewVideoButton(copy) {
    verifyElementCopy(
      this.documentVideoSecondaryButton(),
      copy.doc_video_confirmation.button_secondary
    )
  }

  async chooseToPreviewVideo(copy) {
    this.previewVideoButton(copy)
    this.documentVideoSecondaryButton().click()
  }

  async uploadAndWaitForSpinner(copy) {
    this.uploadVideoButton(copy)
    this.documentVideoUploadButton().click()
    this.spinner().isDisplayed()
  }
}

export default DocumentVideoConfirm
