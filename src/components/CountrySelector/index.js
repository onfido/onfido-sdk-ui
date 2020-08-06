// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import classNames from 'classnames'
import PageTitle from '../PageTitle'
import Button from '../Button'
import FallbackButton from '../Button/FallbackButton'
import { localised } from '../../locales'
import type { LocalisedType } from '../../locales'
import { getSupportedCountriesForDocument } from '../../supported-documents'
import type { CountryType } from '../../supported-documents'
import { trackComponent } from 'Tracker'
import { parseTags } from '~utils'
import theme from 'components/Theme/style.scss'
import style from './style.scss'

import Autocomplete from 'accessible-autocomplete/preact'
import 'accessible-autocomplete/dist/accessible-autocomplete.min.css'

type Props = {
  documentType: string,
  idDocumentIssuingCountry: CountryType,
  previousStep: () => void,
  nextStep: () => void,
  translate: (string, ?{}) => string,
  actions: Object,
} & LocalisedType

type State = {
  showNoResultsError: Boolean,
}

class CountrySelection extends Component<Props, State> {
  state = {
    showNoResultsError: false,
  }

  handleCountrySelect = (selectedCountry: CountryType) => {
    if (selectedCountry) {
      this.setState({
        showNoResultsError: false,
      })
      this.props.actions.setIdDocumentIssuingCountry(selectedCountry)
    } else {
      this.setState({
        showNoResultsError: true,
      })
    }
  }

  suggestCountries = (query: string = '', populateResults: Function) => {
    const countries = getSupportedCountriesForDocument(this.props.documentType)
    const filteredResults = countries.filter((result) => {
      const country = result.name
      return country.toLowerCase().includes(query.trim().toLowerCase())
    })
    populateResults(filteredResults)
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.documentType &&
      this.props.documentType !== prevProps.documentType
    ) {
      this.props.actions.resetIdDocumentIssuingCountry()
    }
  }

  render() {
    const { translate, nextStep, idDocumentIssuingCountry } = this.props
    return (
      <div className={theme.fullHeightContainer}>
        <PageTitle title={translate(`country_selection.title`)} />
        <div
          className={classNames(
            theme.thickWrapper,
            theme.alignTextLeft,
            style.container
          )}
        >
          <div data-onfido-qa="countrySelector">
            <label className={style.label} for="country-finder">
              {translate(`country_selection.search`)}
            </label>
            <Autocomplete
              id="country-finder"
              required={true}
              source={this.suggestCountries}
              minLength={2}
              placeholder={translate(`country_selection.placeholder`)}
              tNoResults={() => translate(`country_selection.error`)}
              dropdownArrow={() => `<i class="${style.caretIcon}"><i/>`}
              displayMenu="overlay"
              templates={{
                inputValue: (country: CountryType) => country && country.name,
                suggestion: (country: CountryType) =>
                  country &&
                  `<span class="${style.countryLabel}">${country.name}</span>`,
              }}
              onConfirm={this.handleCountrySelect}
            />
          </div>
          {this.renderFallback()}
        </div>
        <div className={classNames(theme.thickWrapper)}>
          <Button
            variants={['centered', 'primary', 'lg']}
            disabled={!idDocumentIssuingCountry}
            onClick={nextStep}
            uiTestDataAttribute="countrySelectorNextStep"
          >
            {translate(`country_selection.submit`)}
          </Button>
        </div>
      </div>
    )
  }

  getFallbackCopy = () => {
    const { translate } = this.props
    if (this.state.showNoResultsError) {
      return translate(`country_selection.error`)
    }
    return translate(`country_selection.fallback`)
  }

  renderFallbackLink = ({ text }) => (
    <FallbackButton text={text} onClick={this.props.previousStep} />
  )

  renderFallback = () => {
    const { showNoResultsError } = this.state
    const fallbackText = this.getFallbackCopy()
    return (
      <div className={style.fallbackHelp}>
        <i className={showNoResultsError ? style.errorIcon : style.helpIcon} />
        <span className={style.fallbackText}>
          {parseTags(fallbackText, this.renderFallbackLink)}
        </span>
      </div>
    )
  }
}

export default trackComponent(localised(CountrySelection))
