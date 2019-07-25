import Base from './BasePage.js'
import {locale} from '../utils/mochaw'

class Screen extends Base {
  get backArrow() { return this.$('.onfido-sdk-ui-NavigationBar-iconBack')}

  async clickBackArrow() {
    this.backArrow.click()
  }

  copy(lang) {
    return locale(lang)
  }
}

export default Screen;


