// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import classNames from 'classnames'
import PageTitle from '../PageTitle'
import Button from '../Button'
import { localised } from '../../locales'
import type { LocalisedType } from '../../locales'
import { getSupportedCountriesForDocument } from '../../supported-documents'
import { trackComponent } from 'Tracker'
import { preventDefaultOnClick } from '~utils/index'
import theme from 'components/Theme/style.scss'
import style from './style.scss'

import Autocomplete from 'accessible-autocomplete/preact'
import 'accessible-autocomplete/dist/accessible-autocomplete.min.css'

type Props = {
  documentType: string,
  previousStep: () => void,
  nextStep: () => void,
  translate: (string, ?{}) => string,
  actions: Object,
} & LocalisedType

type State = {
  hasError: Boolean,
}

class CountrySelection extends Component<Props, State> {
  state = {
    hasError: false,
  }

  handleCountrySelect = (selectedCountry: Object) => {
    if (selectedCountry) {
      this.setState({
        hasError: false,
      })
      this.props.actions.setIdDocumentIssuingCountry(selectedCountry)
    } else {
      this.setState({
        hasError: true,
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
                inputValue: (country) => country && country.name,
                suggestion: (country) =>
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
            data-onfido-qa="countrySelectorNextStep"
          >
            {translate(`country_selection.submit`)}
          </Button>
        </div>
      </div>
    )
  }

  getFallbackTextAndLinkStrings = () => {
    const { translate } = this.props
    if (this.state.hasError) {
      const fullErrorFallbackCopy = translate(`country_selection.error`)
      // NOTE: the – character in string exported from Lokalise is an em-dash (long dash)
      const emDash = ' — '
      const errorTextSplit = fullErrorFallbackCopy.split(emDash)
      return {
        text: `${errorTextSplit[0]}${emDash}`,
        link: errorTextSplit[1],
      }
    }
    const fullFallbackCopy = translate(`country_selection.fallback`)
    const fallbackTextSplit = fullFallbackCopy.split(',')
    return {
      text: `${fallbackTextSplit[0]}, `,
      link: fallbackTextSplit[1],
    }
  }

  renderFallback = () => {
    const { hasError } = this.state
    const textAndLinkStringsMap = this.getFallbackTextAndLinkStrings()
    return (
      <div className={style.fallbackHelp}>
        <i className={hasError ? style.errorIcon : style.helpIcon} />
        <span className={style.fallbackText}>{textAndLinkStringsMap.text}</span>
        <a
          href="#"
          className={theme.link}
          onClick={preventDefaultOnClick(this.props.previousStep)}
        >
          {textAndLinkStringsMap.link}
        </a>
      </div>
    )
  }
}

export default trackComponent(localised(CountrySelection))
