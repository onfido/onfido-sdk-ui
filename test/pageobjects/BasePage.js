import { locale } from '../utils/mochaw'

class BasePage {
  constructor(driver, waitAndFind) {
    this.$ = waitAndFind
    this.driver = driver
  }

  async title() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
  async subtitle() { return this.$('.onfido-sdk-ui-PageTitle-subTitle')}
  async backArrow() { return this.$('.onfido-sdk-ui-NavigationBar-iconBack')}

  copy(lang) { return locale(lang) }

  async clickBackArrow() {
    this.clickWhenClickable(this.backArrow())
  }
}

export default BasePage
