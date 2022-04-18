import { localised } from '~locales'
import { getSupportedCountriesForProofOfAddress } from '~supported-documents'
import { trackComponent } from 'Tracker'

import type { CountryData } from '~types/commons'
import { CountrySelectionBase, DocumentProps, Props } from '.'
import { DocumentTypes, PoaTypes } from '~types/steps'
import { WithLocalisedProps, WithTrackingProps } from '~types/hocs'
import { StepComponentBaseProps } from '~types/routers'

export type PoaProps = {
  poaDocumentType: string
  poaDocumentCountry: CountryData
} & Props &
  WithLocalisedProps &
  WithTrackingProps &
  StepComponentBaseProps

class CountrySelection extends CountrySelectionBase {
  hasChanges = (prevProps: Props): boolean | undefined => {
    return (
      prevProps.poaDocumentType &&
      this.props.poaDocumentType !== prevProps.poaDocumentType
    )
  }

  getDocumentProps = (): DocumentProps => {
    const { poaDocumentCountry, poaDocumentType } = this.props

    return {
      documentCountry: poaDocumentCountry,
      documentType: poaDocumentType,
    }
  }

  updateCountry = (selectedCountry: CountryData): void => {
    this.props.actions.setPoADocumentCountry(selectedCountry)
  }

  resetCountry = () => {
    this.props.actions.resetPoADocumentCountry()
  }

  getSupportedCountries = (
    documentType: Optional<PoaTypes | DocumentTypes>
  ): Promise<CountryData[]> => {
    return Promise.resolve(
      getSupportedCountriesForProofOfAddress(documentType as PoaTypes)
    )
  }
}

export default trackComponent(localised(CountrySelection), 'poa_country_select')
