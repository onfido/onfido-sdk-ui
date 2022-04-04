import { h, FunctionComponent } from 'preact'
import { useState } from 'preact/compat'
import { omit } from 'lodash/fp'
import { localised } from '~locales'
import Autocomplete from 'accessible-autocomplete/preact'

import { useLocales } from '~locales'
import { allCountriesList, countryTranslations } from './countries'
import { IconChevronDown } from '@onfido/castor-icons'
import { getCountryFlagSrc } from '~supported-documents'
import type { WithLocalisedProps } from '~types/hocs'
import styles from '../../CountrySelector/style.scss'
import { appendToTracking } from 'Tracker'

type CountryData = {
  countryCode: string
  labelKey?: string
  isoAlpha3: string
  label?: string
}

type Props = {
  value: string | undefined
  error: boolean
  onChange: (value: string) => void
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
  ...omit('labelKey', country),
  //@ts-ignore
  label: countryTranslations[country.labelKey.replace('countriesList.', '')],
}))

const CountrySelector: FunctionComponent<Props> = ({
  value,
  error,
  onChange,
}) => {
  const { translate } = useLocales()
  const [currentValue, setCurrentValue] = useState('')

  const handleChange = (selectedCountry: CountryData) => {
    setCurrentValue(selectedCountry.isoAlpha3)
    onChange?.(selectedCountry.isoAlpha3)
  }

  const suggestCountries = (query: string, populateResults: any) => {
    const filteredResults = options.filter((result) => {
      const country = result.label
      return country.toLowerCase().includes(query.trim().toLowerCase())
    })
    populateResults(filteredResults)
  }

  return (
    <div className={styles.countrySelector}>
      <Autocomplete
        id="country"
        name="country"
        source={suggestCountries}
        showAllValues
        dropdownArrow={() => <IconChevronDown className={styles.chevronIcon} />}
        tNoResults={() =>
          translate('country_select.alert_dropdown.country_not_found')
        }
        displayMenu="overlay"
        cssNamespace={'onfido-sdk-ui-CountrySelector-custom'}
        templates={{
          inputValue: (country: CountryData) => country?.label,
          suggestion: (country: CountryData) =>
            getCountryOptionTemplate(country),
        }}
        onConfirm={handleChange}
        confirmOnBlur={false}
        autoselect={true}
      />
    </div>
  )
}

export default localised(CountrySelector)
