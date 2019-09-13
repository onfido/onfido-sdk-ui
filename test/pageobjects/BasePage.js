import { locale } from '../utils/mochaw'
import { until, By} from 'selenium-webdriver'

class BasePage {
  constructor(driver, $) {
    this.$ = $
    this.driver = driver
  }
  get titleSelector() { return By.css('.onfido-sdk-ui-PageTitle-titleSpan')}
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
