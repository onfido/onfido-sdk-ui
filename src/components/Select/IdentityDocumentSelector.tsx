import { trackComponent } from '../../Tracker'
import {
  DocumentOptions,
  DocumentOptionsType,
} from '../DocumentSelector/documentTypes'
import { CountryConfig, DocumentTypeConfig } from '~types/steps'
import { getCountryDataForDocumentType } from '~supported-documents'
import { DocumentSelectorBase } from '../DocumentSelector'

export const idDocumentOptions: DocumentOptions = {
  passport: {
    labelKey: 'doc_select.button_passport',
    detailKey: 'doc_select.button_passport_detail',
  },
  driving_licence: {
    labelKey: 'doc_select.button_license',
    detailKey: 'doc_select.button_license_detail',
  },
  national_identity_card: {
    labelKey: 'doc_select.button_id',
    detailKey: 'doc_select.button_id_detail',
  },
  residence_permit: {
    labelKey: 'doc_select.button_permit',
    detailKey: 'doc_select.button_permit_detail',
  },
}

class _IdentityDocumentSelector extends DocumentSelectorBase {
  handleDocumentTypeSelected(option: DocumentOptionsType): void {
    const { type: documentType } = option
    const { documentTypes, actions } = this.props

    actions.setIdDocumentType(documentType)

    const selectedDocumentTypeConfig: DocumentTypeConfig | null = documentTypes
      ? documentTypes[documentType]
      : null

    if (documentType !== 'passport' && selectedDocumentTypeConfig) {
      let countryCode: null | string = null
      if (typeof selectedDocumentTypeConfig !== 'boolean') {
        countryCode = (selectedDocumentTypeConfig as CountryConfig).country
      }

      const supportedCountry = getCountryDataForDocumentType(
        countryCode,
        documentType
      )

      if (supportedCountry) {
        actions.setIdDocumentIssuingCountry(supportedCountry)
      } else if (typeof selectedDocumentTypeConfig === 'object') {
        actions.resetIdDocumentIssuingCountry()
        if (countryCode !== null) {
          // Integrators can set document type country to null to suppress Country Selection without setting a country
          // Anything else is an invalid country code
          console.error('Unsupported countryCode:', countryCode)
        }
      }
    }
  }

  subTitleTranslationKey(): string {
    return 'doc_select.subtitle'
  }

  titleTranslationKey(): string {
    return 'doc_select.title'
  }

  getDefaultOptions(): DocumentOptions {
    return idDocumentOptions
  }

  protected shouldAutoFocus(): boolean {
    const { autoFocusOnInitialScreenTitle, steps } = this.props

    return !!autoFocusOnInitialScreenTitle && steps[0].type === 'document'
  }

  pageId(): string {
    return 'IdDocumentSelector'
  }
}

export const SelectIdentityDocument = trackComponent(
  _IdentityDocumentSelector,
  'type_select'
)
