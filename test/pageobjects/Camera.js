import BasePage from './BasePage.js'
import { By } from 'selenium-webdriver'

class Camera extends BasePage {
  get continueButtonSelector() { return By.css('.onfido-sdk-ui-Button-button-primary')}
  get shutterButtonSelector() { return By.css('.onfido-sdk-ui-Photo-btn')}
  get recordButtonSelector() { return By.css('.onfido-sdk-ui-Video-startRecording')}
  get stopButtonSelector() { return By.css('.onfido-sdk-ui-Video-stopRecording') }

  get continueButton() { return this.$('.onfido-sdk-ui-Button-button-primary')}
  get shutterButton() { return this.$('.onfido-sdk-ui-Photo-btn')}
  get recordButton() { return this.$('.onfido-sdk-ui-Video-startRecording')}
  get stopButton() { return this.$('.onfido-sdk-ui-Video-stopRecording') }

  async takeSelfie() {
    await this.waitForElementToBeLocated(this.shutterButtonSelector)
    // This sleep is needed to make sure that the stream includes a face
    this.driver.sleep(1000)
    this.shutterButton.click()
  }

  async startVideoRecording() {
    await this.waitForElementToBeLocated(this.continueButtonSelector)
    this.continueButton.click()
    await this.waitForElementToBeLocated(this.recordButtonSelector)
    this.recordButton.click()
  }

  async completeChallenges() {
    await this.waitForElementToBeLocated(this.continueButtonSelector)
    this.continueButton.click()
    await this.waitForElementToBeLocated(this.stopButtonSelector)
    this.stopButton.click()
  }
}

export default Camera
