import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'
import { assert } from 'chai'

class Camera extends BasePage {
  async enableCameraButton() {
    return this.$('[data-onfido-qa="enable-camera-btn"]')
  }
  async nextChallengeButton() {
    return this.$('[data-onfido-qa="liveness-next-challenge-btn"]')
  }
  async shutterButton() {
    return this.$('.onfido-sdk-ui-Camera-btn')
  }
  async recordButton() {
    return this.$('.onfido-sdk-ui-Video-startRecording')
  }
  async stopButton() {
    return this.$('.onfido-sdk-ui-Video-stopRecording')
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

  async verifyOnfidoFooterIsVisible() {
    assert.isTrue(
      this.onfidoFooter().isDisplayed(),
      'Test Failed: Onfido footer should be present'
    )
  }

  async recordVideo() {
    this.enableCameraButton().click()
    this.recordButton().click()
  }

  async completeChallenges() {
    this.nextChallengeButton().click()
    this.stopButton().click()
  }
}

export default Camera
