import { locale } from '../utils/mochaw'

class BasePage {
  constructor(driver, waitAndFind) {
    this.$ = waitAndFind
    this.driver = driver
  }

  async title() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
  async subtitle() { return this.$('.onfido-sdk-ui-PageTitle-subTitle')}
  async backArrow() { return this.$('.onfido-sdk-ui-NavigationBar-iconBack')}
  async hideLogo() { return this.$('.onfido-sdk-ui-Theme-noLogo')}

  copy(lang) { return locale(lang) }

  async clickBackArrow() {
    this.backArrow().click()
  }

  async checkLogoIsHidden() {
    try {
      return this.hideLogo().isDisplayed()
    } catch (error) {
      console.log("Logo is present:", e)
      return false
    }
  }
}

export default BasePage
