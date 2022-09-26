import { ComponentType, h } from 'preact'
import { trackComponent } from '../../Tracker'
import { DocumentOptions, DocumentOptionsType } from './DocumentList'
import { DocumentSelectorBase, Props } from './index'
import { upperCase } from '~utils/string'
import { PoaTypes } from '~types/steps'
import usePoASupportedCountries from '~contexts/usePoASupportedCountries'
import { map } from '~utils/object'
import { StepComponentProps } from '~types/routers'

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
    const { countryList } = this.props || []

    const options = map(poaDocumentOptions, (config, key) => ({
      ...config,
      checkAvailableInCountry: (code: string) => {
        return countryList
          ?.find((country) => country.country_alpha3 === code)
          ?.document_types.includes(key as PoaTypes)
      },
    }))

    return options as DocumentOptions
  }

  pageId(): string {
    return 'PoaDocumentSelector'
  }
}

const PoADocumentSelection = (props: Props) => {
  const countries = usePoASupportedCountries()

  return <PoADocumentSelector {...props} countryList={countries} />
}

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
  },
  benefit_letters: {
    labelKey: 'doc_select.button_benefits_letter',
    detailKey: 'doc_select.button_benefits_letter_detail',
    icon: 'icon-letter',
  },
  government_letter: {
    labelKey: 'doc_select.button_government_letter',
    detailKey: 'doc_select.button_government_letter_detail',
    icon: 'icon-letter',
  },
}

export default trackComponent(
  PoADocumentSelection,
  'type_select'
) as ComponentType<StepComponentProps>
