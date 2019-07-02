import Base from './BasePage.js'
import {locale, verifyElementCopy} from '../utils/mochaw'
import { testFocusManagement, elementCanReceiveFocus } from '../utils/accessibility'

class Welcome extends Base {
  get title() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
  get subtitle() { return this.$('.onfido-sdk-ui-Welcome-text')}
  get footer() { return this.$('.onfido-sdk-ui-Theme-footer')}
  get primaryBtn() { return this.$('.onfido-sdk-ui-Button-button')}

  copy(lang) {return locale(lang) }

  async verifyTitle(copy) {
    const welcomeScreenStrings = copy.welcome
    verifyElementCopy(this.title, welcomeScreenStrings.title)
    return this.title
  }

  async verifyFocusManagement() {
    testFocusManagement(this.title, this.driver)
  }

  async verifySubtitle(copy) {
    const welcomeScreenStrings = copy.welcome
    verifyElementCopy(this.subtitle, welcomeScreenStrings.description_p_1 + "\n" + welcomeScreenStrings.description_p_2)
  }

  async verifyIdentityButton(copy) {
    const welcomeScreenStrings = copy.welcome
    verifyElementCopy(this.primaryBtn, welcomeScreenStrings.next_button)
    elementCanReceiveFocus(this.primaryBtn, this.driver)
  }

  async verifyFooter() {
    this.footer.isDisplayed()
  }
}

export default Welcome
