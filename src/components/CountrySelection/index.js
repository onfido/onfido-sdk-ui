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

class CountrySelection extends Component<Props, State> {
  handleSelect = (selectedCountry: Object) => {
    this.props.actions.setIdDocumentIssuingCountry(selectedCountry)
  }

  suggest = (query: string = '', populateResults: Function) => {
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
      this.props.actions.setIdDocumentIssuingCountry() // TODO: removeIdDocumentIssuingCountry action
    }
  }

  render() {
    const {
      translate,
      previousStep,
      nextStep,
      idDocumentIssuingCountry,
    } = this.props
    const fullFallbackCopy = translate(`country_selection.fallback`)
    const fallbackTextSplit = fullFallbackCopy.split(',')
    const fallbackText = `${fallbackTextSplit[0]}, `
    const fallbackLink = fallbackTextSplit[1]
    const confirmOnBlur = false // when enabled causes selected country to be wiped on CTA button click
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
              confirmOnBlur={confirmOnBlur}
              onConfirm={this.handleSelect}
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
            disabled={!idDocumentIssuingCountry}
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
