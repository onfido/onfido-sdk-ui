import { trackComponent } from '../../../Tracker'
import {
  DocumentOptions,
  DocumentOptionsType,
} from '../../DocumentSelector/documentTypes'
import { DocumentSelectorBase } from '../../DocumentSelector'
import { upperCase } from '~utils/string'

class PoADocumentSelector extends DocumentSelectorBase {
  handleDocumentTypeSelected(option: DocumentOptionsType): void {
    this.props.actions.setPoADocumentType(option.type)
  }

  subTitleTranslationKey(): string {
    return 'doc_select.subtitle_poa'
  }

  titleTranslationKey(): string {
    return 'doc_select.title_poa'
  }

  getDefaultOptions(): DocumentOptions {
    return poaDocumentOptions
  }

  pageId(): string {
    return 'PoaDocumentSelector'
  }
}

const isUK = (code: string) => upperCase(code) === 'GBR'
const isNonUK = (code: string) => upperCase(code) !== 'GBR'
const unavailable = (code: string) => false

// REFACTOR: move this into the selector as soon as the
export const poaDocumentOptions: DocumentOptions = {
  bank_building_society_statement: {
    labelKey: 'doc_select.button_bank_statement',
    eStatementsKey: 'doc_select.extra_estatements_ok',
  },
  utility_bill: {
    labelKey: 'doc_select.button_bill',
    detailKey: 'doc_select.button_bill_detail',
    warningKey: 'doc_select.extra_no_mobile',
    eStatementsKey: 'doc_select.extra_estatements_ok',
  },
  council_tax: {
    labelKey: 'doc_select.button_tax_letter',
    icon: 'icon-letter',
    checkAvailableInCountry: isUK,
  },
  benefit_letters: {
    labelKey: 'doc_select.button_benefits_letter',
    detailKey: 'doc_select.button_benefits_letter_detail',
    icon: 'icon-letter',
    checkAvailableInCountry: isUK,
  },
  government_letter: {
    labelKey: 'doc_select.button_government_letter',
    detailKey: 'doc_select.button_government_letter_detail',
    icon: 'icon-letter',
    checkAvailableInCountry: unavailable,
  },
}

export default trackComponent(PoADocumentSelector, 'type_select')
