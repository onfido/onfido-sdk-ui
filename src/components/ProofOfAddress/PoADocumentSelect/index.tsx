import { trackComponent } from '../../../Tracker'
import {
  DocumentOptions,
  DocumentOptionsType,
} from '../../DocumentSelector/documentTypes'
import { DocumentSelectorBase, Props } from '../../DocumentSelector'
import { upperCase } from '~utils/string'
import { PoaTypes } from '~types/steps'

type CountryData = {
  country_alpha3: string
  country_alpha2: string
  country: string
  document_types: PoaTypes[]
}

const supportedCountries = require('../../../supported-documents/supported-countries-poa.json')

class PoADocumentSelector extends DocumentSelectorBase {
  constructor(props: Props) {
    super(props)

    this.country = upperCase(props.poaDocumentCountry?.country_alpha3) || 'GBR'
  }

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

const isValidForCountry = (documentType: PoaTypes) => (code: string) => {
  console.log('Checking: ', documentType)
  console.log('Against: ', code)

  const result = supportedCountries
    .find((country: CountryData) => country.country_alpha3 === code)
    ?.document_types.includes(documentType)

  console.log('Result: ', result)

  return result
}

// REFACTOR: move this into the selector as soon as the
export const poaDocumentOptions: DocumentOptions = {
  bank_building_society_statement: {
    labelKey: 'doc_select.button_bank_statement',
    eStatementsKey: 'doc_select.extra_estatements_ok',
    checkAvailableInCountry: isValidForCountry(
      'bank_building_society_statement'
    ),
  },
  utility_bill: {
    labelKey: 'doc_select.button_bill',
    detailKey: 'doc_select.button_bill_detail',
    warningKey: 'doc_select.extra_no_mobile',
    eStatementsKey: 'doc_select.extra_estatements_ok',
    checkAvailableInCountry: isValidForCountry('utility_bill'),
  },
  council_tax: {
    labelKey: 'doc_select.button_tax_letter',
    icon: 'icon-letter',
    checkAvailableInCountry: isValidForCountry('council_tax'),
  },
  benefit_letters: {
    labelKey: 'doc_select.button_benefits_letter',
    detailKey: 'doc_select.button_benefits_letter_detail',
    icon: 'icon-letter',
    checkAvailableInCountry: isValidForCountry('benefit_letters'),
  },
  government_letter: {
    labelKey: 'doc_select.button_government_letter',
    detailKey: 'doc_select.button_government_letter_detail',
    icon: 'icon-letter',
    checkAvailableInCountry: isValidForCountry('government_letter'),
  },
}

export default trackComponent(PoADocumentSelector, 'type_select')
