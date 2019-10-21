import BasePage from './BasePage.js'

class Camera extends BasePage {
  async continueButton () { return this.waitAndFind('.onfido-sdk-ui-Button-button-primary')}
  async shutterButton() { return this.waitAndFind('.onfido-sdk-ui-Photo-btn')}
  async recordButton() { return this.waitAndFind('.onfido-sdk-ui-Video-startRecording')}
  async stopButton() { return this.waitAndFind('.onfido-sdk-ui-Video-stopRecording') }

  async takeSelfie() {
    this.shutterButton().isDisplayed()
    // give some time for the stream to have a face
    this.driver.sleep(1000)
    this.shutterButton().click()
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
