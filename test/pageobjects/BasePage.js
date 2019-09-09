import { locale } from '../utils/mochaw'
import { until } from 'selenium-webdriver'

class BasePage {
  constructor(driver, $) {
    this.$ = $
    this.driver = driver
  }

  get title() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
  get subtitle() { return this.$('.onfido-sdk-ui-PageTitle-subTitle')}
  get backArrow() { return this.$('.onfido-sdk-ui-NavigationBar-iconBack')}

  copy(lang) { return locale(lang) }

  async clickBackArrow() {
    this.backArrow.click()
  }

  async waitForElementToBeLocated(element) {
    this.driver.wait(until.elementLocated((element)))
  }
}

export default BasePage
