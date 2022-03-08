import { h, Component } from 'preact'
import { Button } from '@onfido/castor-react'
import classNames from 'classnames'

import ScreenLayout from '../Theme/ScreenLayout'
import PageTitle from '../PageTitle'
import { localised } from '~locales'
import {
  getSupportedCountriesForDocument,
  getCountryFlagSrc,
} from '~supported-documents'
import { trackComponent } from 'Tracker'
import { parseTags, preventDefaultOnClick } from '~utils'
import { hasOnePreselectedDocument } from '~utils/steps'

import Autocomplete from 'accessible-autocomplete/preact'
import theme from 'components/Theme/style.scss'
import style from './style.scss'

import type { CountryData } from '~types/commons'
import type { WithLocalisedProps, WithTrackingProps } from '~types/hocs'
import type { StepComponentBaseProps } from '~types/routers'

export type Props = {
  documentType: string
  idDocumentIssuingCountry: CountryData
  previousStep: () => void
  nextStep: () => void
} & WithLocalisedProps &
  WithTrackingProps &
  StepComponentBaseProps

type State = {
  showNoResultsError: boolean
}

const getCountryOptionTemplate = (country: CountryData) => {
  if (country) {
    const countryCode = country.country_alpha2
    const countryFlagSrc = getCountryFlagSrc(countryCode, 'square')
    return `<i
      role="presentation"
      class="${style.countryFlag}"
      style="background-image: url(${countryFlagSrc})"></i>
      <span class="${style.countryLabel}">${country.name}</span>`
  }
  return ''
}

class CountrySelection extends Component<Props, State> {
  state = {
    showNoResultsError: false,
  }

  handleCountrySearchConfirm = (selectedCountry: CountryData) => {
    const { actions, idDocumentIssuingCountry } = this.props
    if (selectedCountry) {
      this.setState({
        showNoResultsError: false,
      })
      actions.setIdDocumentIssuingCountry(selectedCountry)
      setTimeout(() => document.getElementById('country-search')?.blur(), 0)
    } else if (
      !selectedCountry &&
      (!idDocumentIssuingCountry || !idDocumentIssuingCountry.country_alpha3)
    ) {
      this.setState({
        showNoResultsError: true,
      })
    }
  }

  suggestCountries = (
    query = '',
    populateResults: (results: CountryData[]) => string[]
  ) => {
    const { documentType, idDocumentIssuingCountry, actions } = this.props
    if (idDocumentIssuingCountry && query !== idDocumentIssuingCountry.name) {
      actions.resetIdDocumentIssuingCountry()
    }

    const countries = getSupportedCountriesForDocument(documentType)
    const filteredResults = countries.filter((result) => {
      const country = result.name
      return country.toLowerCase().includes(query.trim().toLowerCase())
    })
    console.log('1.', populateResults(filteredResults))
    populateResults(filteredResults)
  }

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
    if (this.props.idDocumentIssuingCountry) {
      this.props.actions.resetIdDocumentIssuingCountry()
    }
    document.addEventListener('mousedown', this.handleMenuMouseClick)
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.documentType &&
      this.props.documentType !== prevProps.documentType
    ) {
      this.props.actions.resetIdDocumentIssuingCountry()
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleMenuMouseClick)
  }

  isDocumentPreselected() {
    const { steps, documentType } = this.props
    return hasOnePreselectedDocument(steps) && documentType !== 'passport'
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
      <ScreenLayout
        actions={
          <Button
            type="button"
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
        }
      >
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
                inputValue: (country: CountryData) => country?.name,
                suggestion: (country: CountryData) =>
                  getCountryOptionTemplate(country),
              }}
              onConfirm={this.handleCountrySearchConfirm}
            />
          </div>
          {!this.isDocumentPreselected() &&
            this.state.showNoResultsError &&
            this.renderNoResultsError()}
        </div>
      </ScreenLayout>
    )
  }
}

export default trackComponent(localised(CountrySelection), 'country_select')
