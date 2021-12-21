import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'
import { assert } from 'chai'

class DocumentVideoCapture extends BasePage {
  async errorTitleText() {
    return this.$('.onfido-sdk-ui-Error-title-text')
  }
  async errorInstructionText() {
    return this.$('.onfido-sdk-ui-Error-instruction-text')
  }
  async errorInstructions() {
    return this.$('.onfido-sdk-ui-Error-instruction-text')
  }
  async dismissErrorButton() {
    return this.$('.onfido-sdk-ui-Error-dismiss')
  }
  async errorFallbackButton() {
    return this.$('.onfido-sdk-ui-Button-fallbackButton')
  }
  async startAgain() {
    return this.$('.onfido-sdk-ui-Theme-warningFallbackButton')
  }
  async passportOverlay() {
    return this.$('.onfido-sdk-ui-Overlay-passport')
  }
  async cardOverlay() {
    return this.$('.onfido-sdk-ui-Overlay-card')
  }
  async paperOverlay() {
    return this.$('.onfido-sdk-ui-Overlay-itPaperId')
  }
  async frenchPaperDrivingLicenseOverlay() {
    return this.$('.onfido-sdk-ui-Overlay-frPaperDl')
  }
  async overlayPlaceholder() {
    return this.$('.onfido-sdk-ui-Overlay-placeholder')
  }
  async documentVideoTitle() {
    return this.$('.onfido-sdk-ui-DocumentVideo-reusables-title')
  }
  async documentVideoSubInstructions() {
    return this.$('.onfido-sdk-ui-DocumentVideo-reusables-subtitle')
  }
  async loadingBar() {
    return this.$('.onfido-sdk-ui-DocumentVideo-reusables-active')
  }
  async successTick() {
    return this.$('.onfido-sdk-ui-DocumentVideo-reusables-success')
  }
  async captureButton() {
    //Start Recording , Next Step, Finish Recording
    return this.$('[data-onfido-qa="doc-video-capture-btn"]')
  }
  async progressSteps() {
    return this.$('.onfido-sdk-ui-DocumentVideo-CaptureControls-progress')
  }
  async paperOrPlasticCard() {
    return this.$(
      '.onfido-sdk-ui-DocumentVideo-PaperIdFlowSelector-paperIdFlowSelector'
    )
  }
  async paperOrPlasticCardTitle() {
    return this.$('.onfido-sdk-ui-DocumentVideo-PaperIdFlowSelector-title')
  }
  async plasticCardButton() {
    return this.$('.onfido-sdk-ui-DocumentVideo-PaperIdFlowSelector-cardId')
  }
  async plasticCardTitle() {
    return this.$(
      '.onfido-sdk-ui-DocumentVideo-PaperIdFlowSelector-cardId > span.onfido-sdk-ui-DocumentVideo-PaperIdFlowSelector-text'
    )
  }
  async paperDocumentButton() {
    return this.$('.onfido-sdk-ui-DocumentVideo-PaperIdFlowSelector-paperId')
  }
  async paperDocumentTitle() {
    return this.$(
      '.onfido-sdk-ui-DocumentVideo-PaperIdFlowSelector-paperId > span.onfido-sdk-ui-DocumentVideo-PaperIdFlowSelector-text'
    )
  }
  async userIsToldToKeepPassportPhotoPageWithinFrame(copy) {
    await verifyElementCopy(
      this.documentVideoTitle(),
      copy.doc_video_capture.header_passport
    )
  }

  async userIsToldToKeepStill(copy) {
    await this.documentVideoTitle().isDisplayed()
    await this.verifyUserIsToldToKeepStillLabel(copy)
  }

  async verifyUserIsToldToKeepStillLabel(copy) {
    await verifyElementCopy(
      this.documentVideoTitle(),
      copy.doc_video_capture.header_step1
    )
  }

  async checkBackArrowIsNotDisplayed() {
    try {
      await this.backArrow().isDisplayed()
    } catch (e) {
      console.log('Arrow is present:', e)
      return false
    }
  }

  async nextStepButtonIsNotSeen() {
    const pageSourceString = this.driver.getPageSource().toString()
    const elementVisible = pageSourceString.includes('doc-video-capture-btn')
    assert.isFalse(
      elementVisible,
      'Test Failed: Did not expect to see the Next Button'
    )
  }

  async errorContainerIsNotSeen(assertString) {
    const pageSourceString = this.driver.getPageSource().toString()
    const elementVisible = pageSourceString.includes(
      'onfido-sdk-ui-Error-container'
    )
    assert.isFalse(elementVisible, assertString)
  }

  async cameraNotWorkingErrorIsNotSeen() {
    await this.errorContainerIsNotSeen(
      'Test Failed: Did not expect to see the "Camera not working" error'
    )
  }

  async looksLikeYouTookTooLongErrorIsNotSeen() {
    await this.errorContainerIsNotSeen(
      'Test Failed: Did not expect to see the "Looks like you took too long" error'
    )
  }

  async verifyNextStepButtonLabel(copy) {
    await verifyElementCopy(
      this.captureButton(),
      copy.doc_video_capture.button_primary_fallback
    )
  }

  async nextStepButtonIsClicked(copy) {
    await this.verifyNextStepButtonLabel(copy)
    this.captureButton().click()
  }

  async userIsToldToHoldStill(copy) {
    await verifyElementCopy(
      this.documentVideoTitle(),
      copy.doc_video_capture.header_passport_progress
    )
  }

  async userIsToldToSlowlyTurnDocumentToShowTheBack(copy) {
    await verifyElementCopy(
      this.documentVideoTitle(),
      copy.doc_video_capture.header_step2
    )
  }

  async waitForLoadingBarToComplete() {
    await this.loadingBar().isDisplayed()
    this.driver.sleep(5000)
    await this.loadingBar().isDisplayed()
  }

  async startRecording(copy) {
    await this.verifyStartRecordingButtonLabel(copy)
    this.captureButton().click()
  }

  async verifyStartRecordingButtonLabel(copy) {
    await verifyElementCopy(
      this.captureButton(),
      copy.video_capture.button_primary_start
    )
  }

  async startRecordingButtonIsSeen(copy) {
    await this.captureButton().isDisplayed()
    await verifyElementCopy(
      this.captureButton(),
      copy.video_capture.button_primary_start
    )
  }

  async finishRecording(copy) {
    await this.verifyFinishRecordingButtonLabel(copy)
    this.captureButton().click()
  }

  async verifyFinishRecordingButtonLabel(copy) {
    await verifyElementCopy(
      this.captureButton(),
      copy.video_capture.button_primary_finish
    )
  }

  async paperOrPlasticCardSelectorSeenForDriversLicense(copy) {
    await this.paperOrPlasticCardSelectorIsSeen(copy)
    await verifyElementCopy(
      this.paperOrPlasticCardTitle(),
      copy.doc_capture.prompt.title_license
    )
  }

  async paperOrPlasticCardSelectorSeenForIdCard(copy) {
    await this.paperOrPlasticCardSelectorIsSeen(copy)
    await verifyElementCopy(
      this.paperOrPlasticCardTitle(),
      copy.doc_capture.prompt.title_id
    )
  }

  async paperOrPlasticCardSelectorIsSeen(copy) {
    await this.paperOrPlasticCard().isDisplayed()
    await this.plasticCardButton().isDisplayed()
    await this.paperDocumentButton().isDisplayed()
    await verifyElementCopy(
      this.plasticCardTitle(),
      copy.doc_capture.prompt.button_card
    )
    await verifyElementCopy(
      this.paperDocumentTitle(),
      copy.doc_capture.prompt.button_paper
    )
  }

  async userIsToldToKeepTheFrontSideOfTheDocumentWithinTheFrame(copy) {
    await verifyElementCopy(
      this.documentVideoTitle(),
      copy.doc_video_capture.header
    )
  }

  async userIsToldToKeepDocumentInFullViewAtAllTimes(copy) {
    await verifyElementCopy(
      this.documentVideoSubInstructions(),
      copy.doc_video_capture.detail_step2
    )
  }

  async userIsGivenInstructionsForProfilePhotoSide(copy) {
    await verifyElementCopy(
      this.documentVideoTitle(),
      copy.doc_capture.header_folded_doc_front
    )
    await verifyElementCopy(
      this.documentVideoSubInstructions(),
      copy.doc_capture.detail.folded_doc_front
    )
  }

  async userIsToldToTurnDocumentToShowTheOuterPages(copy) {
    await verifyElementCopy(
      this.documentVideoTitle(),
      copy.doc_video_capture.header_paper_doc_step2
    )
  }

  async userIsShownCameraNotWorkingError(copy) {
    this.driver.sleep(10000)
    await verifyElementCopy(
      this.errorTitleText(),
      copy.selfie_capture.alert.camera_inactive.title
    )
    await verifyElementCopy(
      this.errorInstructionText(),
      copy.selfie_capture.alert.camera_inactive.detail_no_fallback
    )
  }

  async userIsShownLooksLikeYouTookTooLongError(copy) {
    this.driver.sleep(25000)
    await this.errorInstructionText().isDisplayed()
    await verifyElementCopy(
      this.errorTitleText(),
      copy.selfie_capture.alert.timeout.title
    )
  }

  async userCanDismissError() {
    this.dismissErrorButton().click()
  }

  async userCanStartAgain() {
    this.errorFallbackButton().click()
  }

  async userStartsAndCompletesFirstPartOfCapture(copy) {
    await this.startRecording(copy)
    await this.overlayPlaceholder().isDisplayed()
    await this.progressSteps().isDisplayed()
    await this.verifyUserIsToldToKeepStillLabel(copy)
    await this.nextStepButtonIsNotSeen()
    await this.nextStepButtonIsClicked(copy)
    await this.successTick().isDisplayed()
  }

  async userCompletesAnssiFlowForResidentPermit(copy) {
    await this.startRecording(copy)
    await this.progressSteps().isDisplayed()
    await this.nextStepButtonIsClicked(copy)
    await this.successTick().isDisplayed()
    await this.progressSteps().isDisplayed()
    await this.finishRecording(copy)
    await this.successTick().isDisplayed()
  }
}

export default DocumentVideoCapture
