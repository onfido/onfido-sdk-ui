import { h, Component } from 'preact'
import { Button } from '@onfido/castor-react'
import classNames from 'classnames'

import ScreenLayout from '../Theme/ScreenLayout'
import PageTitle from '../PageTitle'
import { parseTags } from '~utils'
import { hasOnePreselectedDocument } from '~utils/steps'

import theme from 'components/Theme/style.scss'
import style from './style.scss'

import type { CountryData } from '~types/commons'
import type { WithLocalisedProps, WithTrackingProps } from '~types/hocs'
import type { StepComponentBaseProps } from '~types/routers'
import { DocumentTypes, PoaTypes } from '~types/steps'
import { CountryDropdown } from './CountryDropdown'

export type Props = {
  previousStep: () => void
  nextStep: () => void
  countryList?: Array<CountryData>
} & WithLocalisedProps &
  WithTrackingProps &
  StepComponentBaseProps

export type DocumentProps = {
  documentCountry: CountryData | undefined
  documentType: PoaTypes | DocumentTypes | undefined
}

type State = {
  showNoResultsError: boolean
  alwaysShowEmptyMessage: boolean
}

export abstract class CountrySelectionBase extends Component<Props, State> {
  state = {
    showNoResultsError: false,
    alwaysShowEmptyMessage: false,
  }

  abstract getDocumentProps: () => DocumentProps
  abstract updateCountry: (selectedCountry: CountryData) => void
  abstract resetCountry: () => void
  abstract renderNoResultsMessage: () => h.JSX.Element
  protected trackScreen?: () => void

  abstract getSupportedCountries: (
    documentType: Optional<PoaTypes | DocumentTypes>
  ) => CountryData[]

  abstract hasChanges: (prevProps: Props) => boolean | undefined

  handleCountrySelect = (selectedCountry: CountryData) => {
    const { documentCountry } = this.getDocumentProps()

    const hasNoCountry =
      !selectedCountry && (!documentCountry || !documentCountry.country_alpha3)

    if (selectedCountry) {
      this.setState({ showNoResultsError: false })
      this.updateCountry(selectedCountry)
      setTimeout(() => document.getElementById('country-search')?.blur(), 0)
    } else if (hasNoCountry) {
      this.setState({ showNoResultsError: true })
    }
  }

  suggestCountries = (
    query = '',
    populateResults: (results: CountryData[]) => string[]
  ) => {
    const { documentCountry, documentType } = this.getDocumentProps()

    if (documentCountry && query !== documentCountry.name) {
      this.resetCountry()
    }

    const countries = this.getSupportedCountries(documentType)

    const filteredResults = countries.filter((country) =>
      country.name.toLowerCase().includes(query.trim().toLowerCase())
    )
    populateResults(filteredResults)
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
    if (this.trackScreen) {
      this.trackScreen()
    }
    this.resetCountry()
    document.addEventListener('mousedown', this.handleMenuMouseClick)
  }

  componentDidUpdate(prevProps: Props) {
    if (this.hasChanges(prevProps)) {
      this.resetCountry()
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleMenuMouseClick)
  }

  isDocumentPreselected() {
    const { documentType } = this.getDocumentProps()
    const { steps } = this.props

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

  render() {
    const { documentCountry } = this.getDocumentProps()
    const { translate, nextStep } = this.props

    const hasNoCountry = !documentCountry || !documentCountry.country_alpha3
    const hasCountrySelectError =
      !this.isDocumentPreselected() && this.state.showNoResultsError

    return (
      <ScreenLayout
        actions={
          <Button
            type="button"
            variant="primary"
            className={classNames(theme['button-centered'], theme['button-lg'])}
            disabled={hasNoCountry || this.state.showNoResultsError}
            onClick={nextStep}
            data-onfido-qa="countrySelectorNextStep"
          >
            {translate('country_select.button_primary')}
          </Button>
        }
      >
        <PageTitle title={translate('country_select.title')} />
        <div className={classNames(theme.alignTextLeft, style.container)}>
          <label className={style.label} htmlFor="country-search">
            {translate('country_select.search.label')}
          </label>
          <CountryDropdown
            {...this.props}
            displayFlags={true}
            placeholder={translate('country_select.search.input_placeholder')}
            noResults={translate(
              'country_select.alert_dropdown.country_not_found'
            )}
            suggestCountries={this.suggestCountries}
            handleCountrySelect={this.handleCountrySelect}
          />
          {(hasCountrySelectError || this.state.alwaysShowEmptyMessage) &&
            this.renderNoResultsMessage()}
        </div>
      </ScreenLayout>
    )
  }
}
