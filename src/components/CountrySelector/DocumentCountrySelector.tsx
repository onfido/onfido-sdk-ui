import { localised } from '~locales'
import { getSupportedCountriesForDocument } from '~supported-documents'
import { trackComponent } from 'Tracker'

import type { CountryData } from '~types/commons'
import type { WithLocalisedProps, WithTrackingProps } from '~types/hocs'
import type { StepComponentBaseProps } from '~types/routers'
import { CountrySelectionBase, DocumentProps, Props } from '.'
import { DocumentTypes, PoaTypes } from '~types/steps'

export type DocProps = {
  documentType: string
  idDocumentIssuingCountry: CountryData
} & Props &
  WithLocalisedProps &
  WithTrackingProps &
  StepComponentBaseProps

class CountrySelection extends CountrySelectionBase {
  hasChanges = (prevProps: Props): boolean | undefined => {
    return (
      prevProps.documentType &&
      this.props.documentType !== prevProps.documentType
    )
  }

  getDocumentProps = (): DocumentProps => {
    const { documentType, idDocumentIssuingCountry } = this.props

    return {
      documentType,
      documentCountry: idDocumentIssuingCountry,
    }
  }

  updateCountry = (selectedCountry: CountryData): void => {
    this.props.actions.setIdDocumentIssuingCountry(selectedCountry)
  }

  resetCountry = () => {
    this.props.actions.resetIdDocumentIssuingCountry()
  }

  getSupportedCountries = (
    documentType: Optional<PoaTypes | DocumentTypes>
  ): CountryData[] => {
    return getSupportedCountriesForDocument(documentType as DocumentTypes)
  }
}

export default trackComponent(localised(CountrySelection), 'country_select')
