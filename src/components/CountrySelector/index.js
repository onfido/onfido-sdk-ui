import { h, Component } from 'preact'
import { Button } from '@onfido/castor-react'
import classNames from 'classnames'
import PageTitle from '../PageTitle'
import { localised /* , type LocalisedType */ } from '../../locales'
import {
  getSupportedCountriesForDocument,
  /* type CountryData, */
} from '../../supported-documents'
import { trackComponent } from 'Tracker'
import {
  parseTags,
  hasOnePreselectedDocument,
  preventDefaultOnClick,
} from '~utils'

import Autocomplete from 'accessible-autocomplete/preact'
import theme from 'components/Theme/style.scss'
import style from './style.scss'

/* type Props = {
  documentType: string,
  idDocumentIssuingCountry: CountryData,
  previousStep: () => void,
  nextStep: () => void,
  translate: (string, ?{}) => string,
  actions: Object,
} & LocalisedType

type State = {
  showNoResultsError: Boolean,
} */

const getFlagIconURL = (country) => {
  // NOTE: `flagsPath` is the same as what is returned by libphonenumber-js in PhoneNumberInput component
  const flagsPath = 'https://lipis.github.io/flag-icon-css/flags/4x3/'
  return `${flagsPath}${country.country_alpha2.toLowerCase()}.svg`
}

const getCountryOptionTemplate = (country) =>
  `<i
      role="presentation"
      class="${style.countryFlag}"
      style="background-image: url(${getFlagIconURL(country)})"></i>
    <span class="${style.countryLabel}">${country.name}</span>`

class CountrySelection extends Component {
  state = {
    showNoResultsError: false,
  }

  handleCountrySearchConfirm = (selectedCountry) => {
    const { actions, idDocumentIssuingCountry } = this.props
    if (selectedCountry) {
      this.setState({
        showNoResultsError: false,
      })
      actions.setIdDocumentIssuingCountry(selectedCountry)
      setTimeout(() => document.getElementById('country-search').blur(), 0)
    } else if (
      !selectedCountry &&
      (!idDocumentIssuingCountry || !idDocumentIssuingCountry.country_alpha3)
    ) {
      this.setState({
        showNoResultsError: true,
      })
    }
  }

  suggestCountries = (query = '', populateResults) => {
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
    return hasOnePreselectedDocument(steps) && documentType !== 'passport'
  }

  getNoResultsTextForDropdown = () =>
    parseTags(
      this.props.translate('country_select.alert_dropdown.country_not_found'),
      ({ text }) => text
    )

  trackChooseAnotherDocumentTypeClick = () => {
    const { trackScreen, previousStep } = this.props
    trackScreen('fallback_clicked')
    previousStep()
  }

  renderNoResultsError = () => {
    const noResultsErrorCopy = this.props.translate(
      'country_select.alert.another_doc'
    )

    return (
      <div className={style.errorContainer}>
        <i className={style.errorIcon} />
        <span className={style.fallbackText}>
          {parseTags(noResultsErrorCopy, ({ text }) => (
            <a
              href="#"
              className={classNames(theme.link, style.fallbackLink)}
              onClick={preventDefaultOnClick(
                this.trackChooseAnotherDocumentTypeClick
              )}
            >
              {text}
            </a>
          ))}
        </span>
      </div>
    )
  }

  render() {
    const { translate, nextStep, idDocumentIssuingCountry } = this.props
    return (
      <div className={theme.fullHeightContainer}>
        <PageTitle title={translate('country_select.title')} />
        <div className={classNames(theme.alignTextLeft, style.container)}>
          <div data-onfido-qa="countrySelector">
            <label className={style.label} htmlFor="country-search">
              {translate('country_select.search.label')}
            </label>
            <Autocomplete
              id="country-search"
              source={this.suggestCountries}
              showAllValues
              dropdownArrow={() => <i className={style.dropdownIcon} />}
              placeholder={translate('country_select.search.input_placeholder')}
              tNoResults={() => this.getNoResultsTextForDropdown()}
              displayMenu="overlay"
              cssNamespace={'onfido-sdk-ui-CountrySelector-custom'}
              templates={{
                inputValue: (country) => country && country.name,
                suggestion: (country) =>
                  country && getCountryOptionTemplate(country),
              }}
              onConfirm={this.handleCountrySearchConfirm}
            />
          </div>
          {!this.isDocumentPreselected() &&
            this.state.showNoResultsError &&
            this.renderNoResultsError()}
        </div>
        <div>
          <Button
            variant="primary"
            className={classNames(theme['button-centered'], theme['button-lg'])}
            disabled={
              !idDocumentIssuingCountry ||
              !idDocumentIssuingCountry.country_alpha3 ||
              this.state.showNoResultsError
            }
            onClick={nextStep}
            data-onfido-qa="countrySelectorNextStep"
          >
            {translate('country_select.button_primary')}
          </Button>
        </div>
      </div>
    )
  }
}

export default trackComponent(localised(CountrySelection), 'country_select')
