import Base from './BasePage.js'
import {locale, verifyElementCopy} from '../utils/mochaw'

class PoaGuidance extends Base {
  get title() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
  get subtitle() { return this.$('.onfido-sdk-ui-ProofOfAddress-Guidance-subTitle')}
  get makeSure() { return this.$('.onfido-sdk-ui-ProofOfAddress-Guidance-makeSure')}
  get logoText() { return this.$('.onfido-sdk-ui-ProofOfAddress-Guidance-label:nth-child(7)')}
  get fullNameext() { return this.$('.onfido-sdk-ui-ProofOfAddress-Guidance-label:nth-child(1)')}

  

  
  

  async verifyTitle(copy) {
    const poaGudanceStrings = copy.capture.bank_building_society_statement.front
    verifyElementCopy(this.title, poaGudanceStrings.title)
  }

}

export default PoaGuidance;
