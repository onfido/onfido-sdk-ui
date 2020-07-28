// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import classNames from 'classnames'
import PageTitle from '../PageTitle'
import Button from '../Button'
import { localised } from '../../locales'
import type { LocalisedType } from '../../locales'
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

const countries = [
  'France',
  'Germany',
  'United Kingdom',
  'Malawi',
  'Malaysia',
  'Madagascar',
]
const suggest = (query, populateResults) => {
  const results = countries
  const filteredResults = results.filter((result) =>
    result.toLowerCase().includes(query.toLowerCase())
  )
  populateResults(filteredResults)
}

class CountrySelection extends Component<Props, State> {
  state: State = {
    selectedCountry: null,
  }

  render() {
    const { previousStep, nextStep, documentType } = this.props
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
              TODO: country list from Docupedia data JSON based on document type
              (pre)selected
            </label>
            <Autocomplete
              id="accessible-autocomplete"
              // cssNamespace={style.countrySelect}
              required={true}
              source={suggest}
              minLength={2}
              dropdownArrow={() => `<i class="${style.caretIcon}"><i/>`}
              displayMenu="overlay"
              templates={{
                suggestion: (suggestion) =>
                  suggestion &&
                  `<span class="${style.countryLabel}">${suggestion}</span>`,
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
              If you can’t find your country,{' '}
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
