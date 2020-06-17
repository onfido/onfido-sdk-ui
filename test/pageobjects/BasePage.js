import { locale } from '../utils/mochaw'
const assert = require('chai').assert

class BasePage {
  constructor(driver, waitAndFind) {
    this.$ = waitAndFind
    this.driver = driver
  }

  async title() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
  async subtitle() { return this.$('.onfido-sdk-ui-PageTitle-subTitle')}
  async backArrow() { return this.$('.onfido-sdk-ui-NavigationBar-iconBack')}
  async noLogo() { return this.$('.onfido-sdk-ui-Theme-noLogo')}

  copy(lang) { return locale(lang) }

  async clickBackArrow() {
    this.backArrow().click()
  }

  async checkLogoIsHidden() {
    assert.isTrue(this.noLogo().isDisplayed(), 'Test Failed: No logo should be displayed')
  }
}

export default BasePage
