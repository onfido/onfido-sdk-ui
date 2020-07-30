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
    const { previousStep, nextStep, documentType } = this.props
    getSupportedCountriesForDocument(documentType)
    return (
      <div className={theme.fullHeightContainer}>
        <PageTitle
          title={'TODO: Get copy from Lokalise'}
          subTitle={`Selected Document Type: ${documentType}`}
        />
        <div
          className={classNames(
            theme.thickWrapper,
            theme.scrollableContent,
            theme.alignTextLeft
          )}
        >
          <div>
            <label for="accessible-autocomplete">
              TODO: country list from Docupedia data JSON
            </label>
            <Autocomplete
              id="accessible-autocomplete"
              required={true}
              source={this.suggest}
              minLength={2}
              dropdownArrow={() => `<i class="${style.caretIcon}"><i/>`}
              displayMenu="overlay"
              templates={{
                inputValue: (country) => country && country.name,
                suggestion: (country) =>
                  country &&
                  `<span class="${style.countryLabel}">${country.name}</span>`,
              }}
              onConfirm={(selectedCountry) => {
                console.log('selected country:', selectedCountry)
                this.setState({ selectedCountry })
              }}
            />
          </div>
          <div className={style.helpTextContainer}>
            <i className={style.helpIcon} />
            <span className={style.helpText}>
              TO_TRANSLATE: If you can’t find your country,{' '}
            </span>
            <a
              href="#"
              className={theme.link}
              onClick={preventDefaultOnClick(previousStep)}
            >
              try another document
            </a>
          </div>
        </div>
        <div className={classNames(theme.thickWrapper)}>
          <Button
            variants={['centered', 'primary', 'lg']}
            disabled={!this.state.selectedCountry}
            onClick={nextStep}
          >
            TODO: same as above
          </Button>
        </div>
      </div>
    )
  }
}

export default trackComponent(localised(CountrySelection))
