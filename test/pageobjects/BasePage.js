import { locale, verifyElementCopy } from '../utils/mochaw'
const assert = require('chai').assert

class BasePage {
  constructor(driver, waitAndFind) {
    this.$ = waitAndFind
    this.driver = driver
  }

  async title() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan') }
  async subtitle() { return this.$('.onfido-sdk-ui-PageTitle-subTitle') }
  async backArrow() { return this.$('.onfido-sdk-ui-NavigationBar-iconBack') }
  async noLogo() { return this.$('.onfido-sdk-ui-Theme-noLogo')}
  async cobrandUI() { return this.$('.onfido-sdk-ui-Theme-cobrandFooter') }
  async cobrandLabel() { return this.$('.onfido-sdk-ui-Theme-cobrandLabel') }
  async cobrandText() { return this.$('.onfido-sdk-ui-Theme-cobrandText') }
  async poweredBy() { return this.$('.onfido-sdk-ui-Theme-poweredBy') }

  copy(lang) { return locale(lang) }

  async clickBackArrow() {
    this.backArrow().click()
  }

  async checkLogoIsHidden() {
    assert.isTrue(this.noLogo().isDisplayed(), 'Test Failed: No logo should be displayed')
  }

  async checkCobrandIsVisible() {
    assert.isTrue(this.cobrandUI().isDisplayed(), 'Test Failed: Cobrand UI should be displayed')
    assert.isTrue(this.cobrandLabel().isDisplayed(), 'Test Failed: Cobrand text should be displayed')
    verifyElementCopy(this.cobrandText(), 'Planet Express, Incorporated')
    verifyElementCopy(this.poweredBy(), 'powered by')
  }
}

export default BasePage
