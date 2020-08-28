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
import type { CountryData } from '../../supported-documents'
import { trackComponent } from 'Tracker'
import { parseTags } from '~utils'
import { enabledDocuments } from '../Router/StepComponentMap'

import Autocomplete from 'accessible-autocomplete/preact'
import theme from 'components/Theme/style.scss'
import style from './style.scss'

type Props = {
  documentType: string,
  idDocumentIssuingCountry: CountryData,
  previousStep: () => void,
  nextStep: () => void,
  translate: (string, ?{}) => string,
  actions: Object,
} & LocalisedType

type State = {
  showNoResultsError: Boolean,
}

const getFlagIconURL = (country: CountryData) => {
  // NOTE: `flagsPath` is the same as what is returned by libphonenumber-js in PhoneNumberInput component
  const flagsPath = 'https://lipis.github.io/flag-icon-css/flags/4x3/'
  return `${flagsPath}${country.country_alpha2.toLowerCase()}.svg`
}

const getCountryOptionTemplate = (country: CountryData) =>
  `<i
      role="presentation"
      class="${style.countryFlag}"
      style="background-image: url(${getFlagIconURL(country)})"></i>
    <span class="${style.countryLabel}">${country.name}</span>`

class CountrySelection extends Component<Props, State> {
  state = {
    showNoResultsError: false,
  }

  handleCountrySearchConfirm = (selectedCountry: CountryData) => {
    if (selectedCountry) {
      this.setState({
        showNoResultsError: false,
      })
      this.props.actions.setIdDocumentIssuingCountry(selectedCountry)
    } else if (!selectedCountry && !this.props.idDocumentIssuingCountry) {
      this.setState({
        showNoResultsError: true,
      })
    }
  }

  suggestCountries = (query: string = '', populateResults: Function) => {
    const { documentType, idDocumentIssuingCountry, actions } = this.props
    if (idDocumentIssuingCountry && query !== idDocumentIssuingCountry.name) {
      actions.resetIdDocumentIssuingCountry()
    }

    const countries = getSupportedCountriesForDocument(documentType)
    const filteredResults = countries.filter((result) => {
      const country = result.name
      return country.toLowerCase().includes(query.trim().toLowerCase())
    })
    populateResults(filteredResults)
  }

  componentDidMount() {
    if (this.props.idDocumentIssuingCountry) {
      this.props.actions.resetIdDocumentIssuingCountry()
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.documentType &&
      this.props.documentType !== prevProps.documentType
    ) {
      this.props.actions.resetIdDocumentIssuingCountry()
    }
  }

  isDocumentPreselected() {
    const { steps, documentType } = this.props
    const enabledIdentityDocuments = enabledDocuments(steps)
    return enabledIdentityDocuments.length === 1 && documentType !== 'passport'
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
            <label className={style.label} for="country-search">
              {translate(`country_selection.search`)}
            </label>
            <Autocomplete
              id="country-search"
              source={this.suggestCountries}
              minLength={2}
              placeholder={translate(`country_selection.placeholder`)}
              tNoResults={() => this.getNoResultsTextForDropdown()}
              displayMenu="overlay"
              cssNamespace={'onfido-sdk-ui-CountrySelector-custom'}
              templates={{
                inputValue: (country: CountryData) => country && country.name,
                suggestion: (country: CountryData) =>
                  country && getCountryOptionTemplate(country),
              }}
              onConfirm={this.handleCountrySearchConfirm}
            />
          </div>
          {!this.isDocumentPreselected() && this.renderFallback()}
        </div>
        <div className={classNames(theme.thickWrapper)}>
          <Button
            variants={['centered', 'primary', 'lg']}
            disabled={
              !idDocumentIssuingCountry || this.state.showNoResultsError
            }
            onClick={nextStep}
            uiTestDataAttribute="countrySelectorNextStep"
          >
            {translate(`country_selection.submit`)}
          </Button>
        </div>
      </div>
    )
  }

  getNoResultsTextForDropdown = () =>
    parseTags(
      this.props.translate(`country_selection.error`),
      ({ text }) => text
    )

  getFallbackCopy = () => {
    const { translate } = this.props
    if (this.state.showNoResultsError) {
      return translate(`country_selection.error`)
    }
    return translate(`country_selection.fallback`)
  }

  trackFallbackClick = () => {
    const { trackScreen, previousStep } = this.props
    trackScreen('fallback_clicked')
    previousStep()
  }

  renderFallbackLink = (text, callback) => (
    <FallbackButton text={text} onClick={callback} />
  )

  renderFallback = () => {
    const { showNoResultsError } = this.state
    const fallbackCopy = this.getFallbackCopy()
    return (
      <div className={style.fallbackHelp}>
        <i className={showNoResultsError ? style.errorIcon : style.helpIcon} />
        <span className={style.fallbackText}>
          {parseTags(fallbackCopy, ({ text }) =>
            this.renderFallbackLink(text, this.trackFallbackClick)
          )}
        </span>
      </div>
    )
  }
}

export default trackComponent(localised(CountrySelection), 'country_select')
