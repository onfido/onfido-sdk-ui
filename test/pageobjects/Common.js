import Base from './BasePage.js'
import {locale} from '../utils/mochaw'

class Common extends Base {
  get backArrow() { return this.$('.onfido-sdk-ui-NavigationBar-iconBack')}

  copy(lang) { return locale(lang) }

  async clickBackArrow() {
    this.backArrow.click()
  }
}

export default Common;


