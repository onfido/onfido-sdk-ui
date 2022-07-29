import { h } from 'preact'
import { Select, Option } from '@onfido/castor-react'
import { useLocales } from '~locales'
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
      <Select {...props} native>
        <Option hidden value="">
          {translate('profile_data.components.country_select.placeholder')}
        </Option>
        {options.map(({ label, isoAlpha3 }) => (
          <Option key={isoAlpha3} value={isoAlpha3}>
            {label}
          </Option>
        ))}
      </Select>
    </div>
  )
}
