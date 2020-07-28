import BasePage from './BasePage.js'

class DummyHostApp extends BasePage {
  async nextStepBtn() {
    return this.$('.qa-step-two-btn')
  }
  async startVerificationBtn() {
    return this.$('.qa-start-verification-btn')
  }
  async firstStepText() {
    return this.$('.qa-first-step-text')
  }
  async secondStepText() {
    return this.$('.qa-second-step-text')
  }

  async continueToNextStep() {
    this.nextStepBtn().click()
  }

  async startVerificationFlow() {
    this.startVerificationBtn().click()
  }

  async firstStepTextDisplayed() {
    this.firstStepText().isDisplayed()
  }

  async secondStepTextDisplayed() {
    this.secondStepText().isDisplayed()
  }
}

export default DummyHostApp
