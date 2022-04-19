import { h } from 'preact'
import { localised } from '~locales'
import { getSupportedCountriesForProofOfAddress } from '~supported-documents'
import { trackComponent } from 'Tracker'
import theme from 'components/Theme/style.scss'
import style from './style.scss'

import type { CountryData } from '~types/commons'
import { CountrySelectionBase, DocumentProps, Props } from '.'
import { DocumentTypes, PoaTypes } from '~types/steps'
import { WithLocalisedProps, WithTrackingProps } from '~types/hocs'
import { StepComponentBaseProps } from '~types/routers'
import { parseTags, preventDefaultOnClick } from '~utils'
import classNames from 'classnames'

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
  ): CountryData[] => {
    return getSupportedCountriesForProofOfAddress(documentType as PoaTypes)
  }

  renderNoResultsMessage = (): h.JSX.Element => {
    const noResultsErrorCopy = this.props.translate(
      'country_select.alert.another_doc'
    )

    return (
      <div className={style.errorContainer}>
        <div>
          <i className={style.helpIcon} />
        </div>
        <div>
          <span className={style.fallbackText}>
            {`Can't find your country?`}
          </span>
          <div className={style.descriptionText}>
            {`Sorry about that. We are working on supporting more countries`}
          </div>
        </div>
      </div>
    )
  }
}

export default trackComponent(localised(CountrySelection), 'poa_country_select')
