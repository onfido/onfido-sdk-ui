import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'
import { testFocusManagement, elementCanReceiveFocus } from '../utils/accessibility'
import { Key } from 'selenium-webdriver'

class Welcome extends BasePage {
  get text() { return this.$('.onfido-sdk-ui-Welcome-text')}
  get footer() { return this.$('.onfido-sdk-ui-Theme-footer')}
  async primaryBtn() { return this.$('.onfido-sdk-ui-Button-button')}
  async openModalButton() { return this.$('#button')}
  get closeModalButton() { return this.$('.onfido-sdk-ui-Modal-closeButton')}

  async verifyTitle(copy) {
    const welcomeStrings = copy.welcome
    verifyElementCopy(this.title(), welcomeStrings.title)
  }

  async verifyFocusManagement() {
    testFocusManagement(this.title(), this.driver)
  }

  async verifySubtitle(copy) {
    const welcomeStrings = copy.welcome
    verifyElementCopy(this.text, welcomeStrings.description_p_1 + "\n" + welcomeStrings.description_p_2)
  }

  async verifyIdentityButton(copy) {
    const welcomeStrings = copy.welcome
    verifyElementCopy(this.primaryBtn(), welcomeStrings.next_button)
    elementCanReceiveFocus(this.primaryBtn(), this.driver)
  }

  async verifyFooter() {
    this.footer.isDisplayed()
  }

  async clickOnOpenModalButton() {
    this.clickWhenClickable(this.openModalButton())
  }

  async clickOnCloseModalButton() {
    this.closeModalButton.click()
  }

  async pressEscapeButton() {
    this.title().sendKeys(Key.ESCAPE)
  }

  async checkBackArrowIsNotDisplayed() {
    try {
      this.backArrow().isDisplayed()
    } catch (e) {
      console.log("Arrow is present:", e)
      return false
    }
  }
}

export default Welcome
