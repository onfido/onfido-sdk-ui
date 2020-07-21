import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'
import {
  testFocusManagement,
  elementCanReceiveFocus,
} from '../utils/accessibility'
import { Key } from 'selenium-webdriver'

class Welcome extends BasePage {
  async text() {
    return this.$('.onfido-sdk-ui-Welcome-text')
  }
  async defaultFooter() {
    return this.$('.onfido-sdk-ui-Theme-footer')
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
    const welcomeStrings = copy.welcome
    verifyElementCopy(this.title(), welcomeStrings.title)
  }

  async verifyFocusManagement() {
    testFocusManagement(this.title(), this.driver)
  }

  async verifySubtitle(copy) {
    const welcomeStrings = copy.welcome
    verifyElementCopy(
      this.text(),
      welcomeStrings.description_p_1 + '\n' + welcomeStrings.description_p_2
    )
  }

  async verifyIdentityButton(copy) {
    const welcomeStrings = copy.welcome
    verifyElementCopy(this.primaryBtn(), welcomeStrings.next_button)
    elementCanReceiveFocus(this.primaryBtn(), this.driver)
  }

  async verifyFooter() {
    this.defaultFooter().isDisplayed()
  }

  async continueToNextStep() {
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
