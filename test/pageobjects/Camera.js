import BasePage from './BasePage.js'
import { By, until } from 'selenium-webdriver'

class Camera extends BasePage {
  get continueButton() { return this.$('.onfido-sdk-ui-Button-button-primary')}
  get shutterButton() { return this.$('.onfido-sdk-ui-Photo-btn')}
  get recordButton() { return this.$('.onfido-sdk-ui-Video-startRecording')}
  get stopButton() { return this.$('.onfido-sdk-ui-Video-stopRecording') }

  async takeSelfie() {
    this.shutterButton.click()
  }

  async startVideoRecording() {
    this.continueButton.click()
    this.driver.sleep(1000)
    this.recordButton.click()
  }

  async completeChallenges() {
    this.continueButton.click()
    this.stopButton.click()
  }

  async waitForCameraShutterButtonToBeLocated() {
    this.driver.wait(until.elementLocated(By.css('.onfido-sdk-ui-Photo-btn')))
  }
}

export default Camera
