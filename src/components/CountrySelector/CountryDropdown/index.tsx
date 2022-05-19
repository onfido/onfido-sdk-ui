import { h, Component } from 'preact'

import { getCountryFlagSrc } from '~supported-documents'
import { parseTags } from '~utils'
import Autocomplete from 'accessible-autocomplete/preact'
import style from './style.scss'

import type { CountryData } from '~types/commons'
import type { WithLocalisedProps } from '~types/hocs'
import { DocumentTypes, PoaTypes } from '~types/steps'

export type SuggestedCountries = (
  query: string,
  populateResults: (results: CountryData[]) => string[]
) => void

export type HandleCountrySelect = (selectedCountry: CountryData) => void

export type CountryDropdownProps = {
  suggestCountries: SuggestedCountries
  handleCountrySelect: HandleCountrySelect
} & WithLocalisedProps

export type DocumentProps = {
  documentCountry: CountryData | undefined
  documentType: PoaTypes | DocumentTypes | undefined
}

const getCountryOptionTemplate = (country: CountryData) => {
  if (!country) {
    return ''
  }
  const countryCode = country.country_alpha2
  const countryFlagSrc = getCountryFlagSrc(countryCode, 'square')
  return `<i
      role="presentation"
      class="${style.countryFlag}"
      style="background-image: url(${countryFlagSrc})"></i>
      <span class="${style.countryLabel}">${country.name}</span>`
}

export class CountryDropdown extends Component<CountryDropdownProps> {
  handleMenuMouseClick = (event: Event) => {
    const target = event.target as HTMLUListElement
    // Intercept mouse click if event target is the displayed menu, i.e. scrollbar area
    // (mouse clicks in on the menu list options the target will be a different class)
    // Otherwise accessible-autocomplete picks up a mouse click on scrollbar area as a confirm event
    if (
      target.className.includes(
        'onfido-sdk-ui-CountrySelector-custom__menu--visible'
      )
    ) {
      event.preventDefault()
    }
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleMenuMouseClick)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleMenuMouseClick)
  }

  getNoResultsTextForDropdown = () => {
    if (typeof this.props.translate === undefined) {
      return
    }
    return parseTags(
      this.props.translate('country_select.alert_dropdown.country_not_found'),
      ({ text }) => text
    )
  }

  render() {
    const { translate } = this.props
    return (
      <div data-onfido-qa="countrySelector">
        <label className={style.label} htmlFor="country-search">
          {translate('country_select.search.label')}
        </label>
        <Autocomplete
          id="country-search"
          source={this.props.suggestCountries}
          showAllValues
          dropdownArrow={() => <i className={style.dropdownIcon} />}
          placeholder={translate('country_select.search.input_placeholder')}
          tNoResults={() => this.getNoResultsTextForDropdown()}
          displayMenu="overlay"
          cssNamespace={'onfido-sdk-ui-CountrySelector-CountryDropdown-custom'}
          templates={{
            inputValue: (country: CountryData) => country?.name,
            suggestion: (country: CountryData) =>
              getCountryOptionTemplate(country),
          }}
          onConfirm={this.props.handleCountrySelect}
        />
      </div>
    )
  }
}
