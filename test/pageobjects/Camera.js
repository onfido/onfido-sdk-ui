import Base from './BasePage.js'

class Camera extends Base {
  get title() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
  get continueBtn() { return this.$('.onfido-sdk-ui-Button-button-primary')}
  get shutterButton() { return this.$('.onfido-sdk-ui-Photo-btn')}
  get recordButton() { return this.$('.onfido-sdk-ui-Video-startRecording')}
  get stopButton() { return this.$('.onfido-sdk-ui-Video-stopRecording') }

  async takeSelfie() {
    this.driver.sleep(2000)
    this.shutterButton.click()
  }

  async startVideoRecording() {
    this.continueBtn.click()
    this.driver.sleep(1000)
    this.recordButton.click()
  }

  async completeChallenges() {
    this.continueBtn.click()
    this.stopButton.click()
  }
}

export default Camera
