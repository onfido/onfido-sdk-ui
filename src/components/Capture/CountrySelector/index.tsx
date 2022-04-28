import { h, FunctionComponent } from 'preact'
import { useState } from 'preact/compat'
import { Icon } from '@onfido/castor-react'
import { omit } from '../../utils/object'
import { localised, useLocales } from '~locales'
import Autocomplete from 'accessible-autocomplete/preact'

import { allCountriesList, countryTranslations } from './countries'
import { getCountryFlagSrc } from '~supported-documents'

import type { WithLocalisedProps } from '~types/hocs'
import styles from '../../CountrySelector/style.scss'

type CountryData = {
  countryCode: string
  labelKey: string
  isoAlpha3: string
  label?: string
}

type Props = {
  value?: number | string
  onChange?: (ev: { target: { value: string } }) => void
} & WithLocalisedProps

const getCountryOptionTemplate = (country: CountryData) => {
  if (country) {
    const countryCode = country.countryCode
    const countryFlagSrc = getCountryFlagSrc(countryCode, 'square')
    return `<i
        role="presentation"
        class="${styles.countryFlag}"
        style="background-image: url(${countryFlagSrc})"></i>
        <span class="${styles.countryLabel}">${country.label}</span>`
  }
  return ''
}

const options = allCountriesList.map((country: CountryData) => ({
  ...omit(country, ['labelKey']),
  //@ts-ignore
  label: countryTranslations[country.labelKey.replace('countriesList.', '')],
}))

const CountrySelector: FunctionComponent<Props> = ({ onChange }) => {
  const { translate } = useLocales()
  const [, setCurrentValue] = useState('')

  const handleChange = (selectedCountry: CountryData) => {
    setCurrentValue(selectedCountry.isoAlpha3)
    onChange?.({ target: { value: selectedCountry.isoAlpha3 } })
  }

  const suggestCountries = (query: string, populateResults: any) => {
    const filteredResults = options.filter((result) => {
      const country = result.label
      return country.toLowerCase().includes(query.trim().toLowerCase())
    })
    populateResults(filteredResults)
  }

  return (
    <Autocomplete
      id="country"
      name="country"
      source={suggestCountries}
      showAllValues
      dropdownArrow={() => (
        <Icon
          name="chevron-down"
          className={styles.chevronIcon}
          aria-hidden="true"
        />
      )}
      tNoResults={() =>
        translate('country_select.alert_dropdown.country_not_found')
      }
      displayMenu="overlay"
      cssNamespace={'onfido-sdk-ui-CountrySelector-custom'}
      templates={{
        inputValue: (country: CountryData) => country?.label,
        suggestion: (country: CountryData) => getCountryOptionTemplate(country),
      }}
      onConfirm={handleChange}
      confirmOnBlur={false}
      autoselect={true}
    />
  )
}

export default localised(CountrySelector)
