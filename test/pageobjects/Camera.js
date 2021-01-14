import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'

class Camera extends BasePage {
  async continueButton() {
    return this.$('.onfido-sdk-ui-Button-button-primary')
  }
  async shutterButton() {
    return this.$('.onfido-sdk-ui-Camera-btn')
  }
  async recordButton() {
    return this.$('.onfido-sdk-ui-FaceVideo-startRecording')
  }
  async stopButton() {
    return this.$('.onfido-sdk-ui-FaceVideo-stopRecording')
  }
  async warningMessage() {
    return this.$('.onfido-sdk-ui-Error-container-warning')
  }
  async faceOverlay() {
    return this.$('[data-onfido-qa="faceOverlay"]')
  }

  async verifySelfieTitle(copy) {
    verifyElementCopy(this.title(), copy.selfie_capture.title)
  }

  async verifyVideoTitle(copy) {
    verifyElementCopy(this.title(), copy.video_capture.body)
  }

  async takeSelfie() {
    // give some time for the stream to have a face
    this.driver.sleep(1000)
    this.shutterButton().click()
  }

  async isOverlayPresent() {
    const cameraClasses = this.faceOverlay().getAttribute('class').split(' ')
    return cameraClasses.includes('onfido-sdk-ui-Overlay-isWithoutHole')
  }

  async recordVideo() {
    this.continueButton().click()
    this.recordButton().click()
  }

  async completeChallenges() {
    this.continueButton().click()
    this.stopButton().click()
  }
}

export default Camera
