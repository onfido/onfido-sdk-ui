import BasePage from './BasePage.js'

class Camera extends BasePage {
  async continueButton () { return this.$('.onfido-sdk-ui-Button-button-primary')}
  async shutterButton() { return this.$('.onfido-sdk-ui-Camera-btn')}
  async recordButton() { return this.$('.onfido-sdk-ui-Video-startRecording')}
  async stopButton() { return this.$('.onfido-sdk-ui-Video-stopRecording') }
  async warningMessage() { return this.$('.onfido-sdk-ui-Error-container-warning') }
  async faceOverlay() { return this.$('[data-onfido-qa="faceOverlay"]') }

  async takeSelfie() {
    // give some time for the stream to have a face
    this.driver.sleep(1000)
    this.shutterButton().click()
  }

  async isOverlayPresent() {
    const cameraClasses = this.faceOverlay().getAttribute("class").split(" ")
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
