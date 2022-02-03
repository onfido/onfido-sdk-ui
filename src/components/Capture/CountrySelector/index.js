import { h } from 'preact'
import { useState } from 'preact/compat'
import Autocomplete from 'accessible-autocomplete/preact'
import { localised } from '~locales'
import { omit } from 'lodash/fp'
import { allCountriesList, countryTranslations } from './countries'
import { IconChevronDown } from '@onfido/castor-icons'
import { getCountryFlagSrc } from '~supported-documents'
import styles from '../../CountrySelector/style.scss'

const getCountryOptionTemplate = (country) => {
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

const options = allCountriesList.map((country) => ({
  ...omit('labelKey', country),
  label: countryTranslations[country.labelKey.replace('countriesList.', '')],
}))

const CountrySelector = ({ value, error, onChange, ...props }) => {
  const { translate } = props
  const [currentValue, setCurrentValue] = useState()

  const handleChange = (selectedCountry) => {
    setCurrentValue(selectedCountry.isoAlpha3)
    onChange?.(selectedCountry.isoAlpha3)
  }

  const suggestCountries = (query, populateResults) => {
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
        required={true}
        source={suggestCountries}
        showAllValues
        dropdownArrow={() => <IconChevronDown className={styles.chevronIcon} />}
        placeholder={translate('profile_data.country_placeholder')}
        displayMenu="overlay"
        cssNamespace={'onfido-sdk-ui-CountrySelector-custom'}
        templates={{
          inputValue: (country) => country?.label,
          suggestion: (country) => getCountryOptionTemplate(country),
        }}
        onConfirm={handleChange}
        confirmOnBlur={false}
        defaultValue={currentValue}
      />
    </div>
  )
}

export default localised(CountrySelector)
