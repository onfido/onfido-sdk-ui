import { locale } from '../utils/mochaw'

class BasePage {
  constructor(driver, $, waitAndFind) {
    this.$ = $
    this.driver = driver
    this.waitAndFind = waitAndFind
  }

  async title() { return this.waitAndFind('.onfido-sdk-ui-PageTitle-titleSpan')}
  get subtitle() { return this.$('.onfido-sdk-ui-PageTitle-subTitle')}
  get backArrow() { return this.$('.onfido-sdk-ui-NavigationBar-iconBack')}

  copy(lang) { return locale(lang) }

  async clickBackArrow() {
    this.backArrow.click()
  }
}

export default BasePage
