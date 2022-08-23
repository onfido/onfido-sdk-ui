import 'react-phone-number-input/style.css'
import { classy } from '@onfido/castor'
import { getCountryFlagSrc } from '~supported-documents'
import { h } from 'preact'
import { localised } from '~locales'
import { parsePhoneNumberFromString } from 'libphonenumber-js/mobile'
import { useCallback, useEffect } from 'preact/hooks'
import { WithLocalisedProps } from '~types/hocs'
import classNames from 'classnames'
import PhoneInput, { Country } from 'react-phone-number-input'
import type { SdkOptions } from '~types/sdk'

import style from './style.scss'

const FlagComponent = ({ country }: { country: string }) => (
  <span
    className={classNames('react-phone-number-input__icon', style.flagIcon)}
    style={{
      'background-image': `url(${getCountryFlagSrc(country, 'rectangle')})`,
    }}
  />
)

export type PhoneNumberInputProps = {
  value: string
  invalid: boolean
  onBlur: () => void
  onChange: (ev: {
    target: {
      value: string
    }
  }) => void
  smsNumberCountryCode?: Country
  options: SdkOptions
} & WithLocalisedProps

const PhoneNumberInput = ({
  value,
  onBlur,
  onChange,
  invalid,
  smsNumberCountryCode,
  options,
  translate,
}: PhoneNumberInputProps) => {
  const injectForCountrySelectAriaLabel = useCallback(() => {
    // HACK: This is necessary as setting the ARIA label with react-phone-number-input library `labels` property
    //       available in v3 loses the human readable country names.
    //       Also not clear in library's CHANGELOG how to use `countrySelectProps` to set ARIA label for
    //       country select component as suggested there.
    const countrySelectEl = options.containerEl
      ? options.containerEl.querySelectorAll('.PhoneInputCountrySelect')
      : document.getElementsByClassName('PhoneInputCountrySelect')

    if (countrySelectEl && countrySelectEl.length > 0) {
      countrySelectEl[0].setAttribute(
        'aria-label',
        translate('country_select.search.accessibility')
      )
    }
  }, [options.containerEl, translate])

  useEffect(() => {
    injectForCountrySelectAriaLabel()
  }, [injectForCountrySelectAriaLabel])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePhoneNumberChange = (phoneNumber: any) => {
    if (!phoneNumber) {
      return
    }

    const parsedNumber = parsePhoneNumberFromString(phoneNumber)
    onChange({ target: { value: `${parsedNumber?.number}` } })
  }

  return (
    <div className={classy(style['wrapper'], invalid ? style['invalid'] : '')}>
      <PhoneInput
        onBlur={onBlur}
        id="phoneNumberInput"
        className={`${style.phoneNumberContainer}`}
        value={value}
        onChange={handlePhoneNumberChange}
        defaultCountry={smsNumberCountryCode}
        flagComponent={FlagComponent}
      />
    </div>
  )
}

export default localised(PhoneNumberInput)
