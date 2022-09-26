import { h, Component } from 'preact'

import { getCountryFlagSrc } from '~supported-documents'
import Autocomplete from 'accessible-autocomplete/preact'
import style from './style.scss'

import type { CountryData } from '~types/commons'
import { DocumentTypes, PoaTypes } from '~types/steps'

export type SuggestedCountries = (
  query: string,
  populateResults: (results: CountryData[]) => string[]
) => void

export type HandleCountrySelect = (selectedCountry: CountryData) => void

export type CountryDropdownProps = {
  suggestCountries: SuggestedCountries
  handleCountrySelect: HandleCountrySelect
  placeholder: string
  noResults: string
  displayFlags: boolean
}

export type DocumentProps = {
  documentCountry: CountryData | undefined
  documentType: PoaTypes | DocumentTypes | undefined
}

const getCountryOptionTemplate = (
  country: CountryData,
  displayFlags: boolean
) => {
  if (!country) {
    return ''
  }

  if (displayFlags) {
    const countryFlagSrc = getCountryFlagSrc(country.country_alpha2, 'square')
    return `<img
      role="presentation"
      class="${style.countryFlag}"
      src="${countryFlagSrc}"/>
      <span class="${style.countryFlagLabel}">${country.name}</span>`
  }

  return `<span class="${style.countryLabel}">${country.name}</span>`
}

export class CountryDropdown extends Component<CountryDropdownProps> {
  static defaultProps = {
    displayFlags: false,
  }

  handleMenuMouseClick = (event: Event) => {
    const target = event.target as HTMLUListElement
    // Intercept mouse click if event target is the displayed menu, i.e. scrollbar area
    // (mouse clicks in on the menu list options the target will be a different class)
    // Otherwise accessible-autocomplete picks up a mouse click on scrollbar area as a confirm event
    if (
      target.className.includes(
        'onfido-sdk-ui-CountrySelector-CountryDropdown-custom__menu--visible'
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

  render() {
    return (
      <div data-onfido-qa="countrySelector">
        <Autocomplete
          id="country-search"
          source={this.props.suggestCountries}
          showAllValues
          dropdownArrow={() => <i className={style.dropdownIcon} />}
          placeholder={this.props.placeholder}
          tNoResults={() => this.props.noResults}
          displayMenu="overlay"
          cssNamespace={'onfido-sdk-ui-CountrySelector-CountryDropdown-custom'}
          templates={{
            inputValue: (country: CountryData) => country?.name,
            suggestion: (country: CountryData) =>
              getCountryOptionTemplate(country, this.props.displayFlags),
          }}
          onConfirm={this.props.handleCountrySelect}
        />
      </div>
    )
  }
}
