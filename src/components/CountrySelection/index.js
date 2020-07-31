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
} & LocalisedType

type State = {
  selectedCountry: string,
}

class CountrySelection extends Component<Props, State> {
  state: State = {
    selectedCountry: null,
  }

  suggest = (query, populateResults) => {
    const countries = getSupportedCountriesForDocument(this.props.documentType)
    const results = countries
    const filteredResults = results.filter((result) => {
      const country = result.name
      return country.toLowerCase().includes(query.toLowerCase())
    })
    populateResults(filteredResults)
  }

  render() {
    const { translate, previousStep, nextStep } = this.props
    const fullFallbackCopy = translate(`country_selection.fallback`)
    const fallbackTextSplit = fullFallbackCopy.split(',')
    const fallbackText = `${fallbackTextSplit[0]}, `
    const fallbackLink = fallbackTextSplit[1]
    return (
      <div className={theme.fullHeightContainer}>
        <PageTitle title={translate(`country_selection.title`)} />
        <div
          className={classNames(
            theme.thickWrapper,
            theme.scrollableContent,
            theme.alignTextLeft
          )}
        >
          <div>
            <label className={style.text} for="country-finder">
              {translate(`country_selection.search`)}
            </label>
            <Autocomplete
              id="country-finder"
              required={true}
              source={this.suggest}
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
              onConfirm={(selectedCountry) => this.setState({ selectedCountry })}
            />
          </div>
          <div className={style.helpTextContainer}>
            <i className={style.helpIcon} />
            <span className={style.text}>{fallbackText}</span>
            <a
              href="#"
              className={theme.link}
              onClick={preventDefaultOnClick(previousStep)}
            >
              {fallbackLink}
            </a>
          </div>
        </div>
        <div className={classNames(theme.thickWrapper)}>
          <Button
            variants={['centered', 'primary', 'lg']}
            disabled={!this.state.selectedCountry}
            onClick={nextStep}
          >
            {translate(`country_selection.submit`)}
          </Button>
        </div>
      </div>
    )
  }
}

export default trackComponent(localised(CountrySelection))
