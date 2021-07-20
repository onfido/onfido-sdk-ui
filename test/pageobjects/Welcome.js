import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'
import { testFocusManagement } from '../utils/accessibility'
import { Key } from 'selenium-webdriver'

class Welcome extends BasePage {
  async subtitle() {
    return this.$('.onfido-sdk-ui-PageTitle-subTitle')
  }
  async customDescriptions() {
    return this.$('.onfido-sdk-ui-Welcome-customDescriptions')
  }
  async instructions() {
    return this.$('.onfido-sdk-ui-Welcome-instructions')
  }
  async defaultFooter() {
    return this.$('.onfido-sdk-ui-Theme-footer')
  }
  async recordingLimit() {
    return this.$('.onfido-sdk-ui-Welcome-recordingLimit')
  }
  async primaryBtn() {
    return this.$('[data-onfido-qa="welcome-next-btn"]')
  }
  async sdkModal() {
    return this.$('.onfido-sdk-ui-Modal-inner')
  }
  async openModalButton() {
    return this.$('#button')
  }
  async closeModalButton() {
    return this.$('.onfido-sdk-ui-Modal-closeButton')
  }

  async verifyTitle(copy) {
    verifyElementCopy(this.title(), copy.welcome.title)
  }

  async verifyCustomTitle() {
    verifyElementCopy(this.title(), 'Open your new bank account')
  }

  async verifyFocusManagement() {
    testFocusManagement(this.title(), this.driver)
  }

  async verifySubtitle(copy) {
    verifyElementCopy(this.subtitle(), copy.welcome.subtitle)
  }

  async verifyDefaultInstructions(copy) {
    verifyElementCopy(
      this.instructions(),
      [
        copy.welcome.list_header_webcam,
        copy.welcome.list_item_doc,
        copy.welcome.list_item_selfie,
      ].join('\n')
    )
  }

  async verifyDocVideoInstructions(copy) {
    verifyElementCopy(
      this.instructions(),
      [
        copy.welcome.list_header_doc_video,
        copy.welcome.list_item_doc,
        copy.welcome.list_item_selfie,
      ].join('\n')
    )
  }

  async verifyRecordingLimit(copy) {
    verifyElementCopy(
      this.recordingLimit(),
      copy.welcome.list_item_doc_video_timeout.replace(
        '<timeout></timeout>',
        30
      )
    )
  }

  async verifyCustomDescriptions() {
    verifyElementCopy(
      this.customDescriptions(),
      `To open a bank account, we will need to verify your identity.\nIt will only take a couple of minutes.`
    )
  }

  async verifyPrimaryButton(copy) {
    verifyElementCopy(this.primaryBtn(), copy.welcome.next_button)
  }

  async verifyCustomPrimaryButton() {
    verifyElementCopy(this.primaryBtn(), 'Verify Identity')
  }

  async verifyFooter() {
    this.defaultFooter().isDisplayed()
  }

  async continueToNextStep() {
    //On rare occasions, there are cases when the page hasn't quite loaded, hence the need for the sleep
    this.driver.sleep(100)
    this.primaryBtn().click()
  }

  async clickOnOpenModalButton() {
    this.openModalButton().click()
  }

  async clickOnCloseModalButton() {
    this.closeModalButton().click()
  }

  async pressEscapeButton() {
    this.closeModalButton().sendKeys(Key.ESCAPE)
  }

  async checkBackArrowIsNotDisplayed() {
    try {
      this.backArrow().isDisplayed()
    } catch (e) {
      console.log('Arrow is present:', e)
      return false
    }
  }
}

export default Welcome
