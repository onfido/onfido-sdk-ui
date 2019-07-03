import Base from './BasePage.js'
import {locale, verifyElementCopy} from '../utils/mochaw'

class PoADocumentSelection extends Base {
  get poaDocumentSelectionTitle() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
  get poaDocumentSelectionSubtitle() { return this.$('.onfido-sdk-ui-PageTitle-titleWrapper > div:nth-child(2)')}

  copy(lang) { return locale(lang) }

  async verifyPoaDocumentSelectionTitle(copy) {
    verifyElementCopy(this.poaDocumentSelectionTitle, copy)
  }

  async verifyPoaDocumentSelectionSubtitle(copy) {
    const poaDocumentSelectionStrings = copy.proof_of_address
    verifyElementCopy(this.poaDocumentSelectionSubtitle, poaDocumentSelectionStrings.hint)
  }
}

export default PoADocumentSelection;
