import { h } from 'preact'
import { localised } from '~locales'
import { trackComponent } from 'Tracker'
import style from './style.scss'

import type { CountryData } from '~types/commons'
import { CountrySelectionBase, DocumentProps, Props } from '.'
import { WithLocalisedProps, WithTrackingProps } from '~types/hocs'
import { StepComponentBaseProps } from '~types/routers'
import usePoASupportedCountries from '~contexts/usePoASupportedCountries'

export type PoaProps = {
  poaDocumentType: string
  poaDocumentCountry: CountryData
} & Props &
  WithLocalisedProps &
  WithTrackingProps &
  StepComponentBaseProps

class CountrySelection extends CountrySelectionBase {
  constructor(props: Props) {
    super(props)

    this.state.alwaysShowEmptyMessage = true
  }

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

  getSupportedCountries = (): CountryData[] => {
    return this.props.countryList || []
  }

  renderNoResultsMessage = (): h.JSX.Element => {
    const errorIntro = this.props.translate('country_select.poa_alert.intro')
    const errorDescription = this.props.translate(
      'country_select.poa_alert.country_not_found'
    )

    return (
      <div className={style.errorContainer}>
        <div>
          <i className={style.helpIcon} />
        </div>
        <div>
          <span className={style.fallbackText}>{errorIntro}</span>
          <div className={style.descriptionText}>{errorDescription}</div>
        </div>
      </div>
    )
  }
}

const PoACountrySelector = (props: Props) => {
  const poaCountries = usePoASupportedCountries()

  const countries: CountryData[] = poaCountries.map((country) => ({
    country_alpha2: country.country_alpha2,
    country_alpha3: country.country_alpha3,
    name: country.country,
  }))

  return <CountrySelection {...props} countryList={countries} />
}

export default trackComponent(
  localised(PoACountrySelector),
  'poa_country_select'
)
