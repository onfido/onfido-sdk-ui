import { h } from 'preact'
import { Select, Option } from '@onfido/castor-react'
import { useLocales } from '~locales'
import { getCountryFlagSrc } from '~supported-documents'
import { allCountriesList, countryTranslations } from './countries'
import styles from './styles.scss'

const options = allCountriesList.map((country) => ({
  ...country,
  // @ts-ignore
  label: countryTranslations[country.countryCode.toLowerCase()],
}))

export type CountrySelectorProps = {
  name?: string
  value?: number | string
  invalid?: boolean
  onChange?: (ev: { target: { value: string } }) => void
}

export const CountrySelector = (props: CountrySelectorProps) => {
  const { translate } = useLocales()

  return (
    <div className={styles.countrySelector}>
      <Select {...props}>
        <Option hidden value="">
          {translate('profile_data.components.country_select.placeholder')}
        </Option>
        {options.map(({ label, countryCode, isoAlpha3 }) => {
          const countryFlagSrc = getCountryFlagSrc(countryCode, 'square')

          return (
            <Option key={isoAlpha3} value={isoAlpha3}>
              <img
                role="presentation"
                src={countryFlagSrc}
                className={styles['countryFlag']}
              />
              <span className={styles['countryLabel']}>{label}</span>
            </Option>
          )
        })}
      </Select>
    </div>
  )
}
