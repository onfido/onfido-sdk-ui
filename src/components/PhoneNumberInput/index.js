import { h } from 'preact'
import PhoneNumber, {isValidPhoneNumber} from 'react-phone-number-input'
import countries from 'react-phone-number-input/modules/countries'

import classNames from 'classnames';
import {localised} from '../../locales'
import {lowerCase, upperCase} from '../utils/string'
import {includes} from '../utils/array'


import 'react-phone-number-input/rrui.css'
import 'react-phone-number-input/style.css'
import style from './style.css'

const FlagComponent = ({ countryCode, flagsPath }) => (
  <span
    className={ classNames('react-phone-number-input__icon', style.flagIcon) }
    style={{
      'background-image': `url(${ flagsPath }${ countryCode.toLowerCase() }.svg)`,
    }}
  />
);

const PhoneNumberInput = ({ translate, clearErrors, actions = {}, smsNumberCountryCode}) => {

  const onChange = (number) => {
    clearErrors()
    const valid = isValidPhoneNumber(number)
    actions.setMobileNumber({number, valid})
  }

  const validCountryCode = () => {
    const isCountryCodeInCountriesList = includes(countries.flat(), lowerCase(smsNumberCountryCode))
    const isValid = smsNumberCountryCode.length === 2 && isCountryCodeInCountriesList
    if (!isValid) { console.warn("Invalid ISO Country Code") }
    return isValid
  }

  const countryCode = () => {
    if (!smsNumberCountryCode) return 'GB'
    return validCountryCode() ? upperCase(smsNumberCountryCode) : 'GB'
  }

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <PhoneNumber placeholder={translate('cross_device.phone_number_placeholder')}
        onChange={onChange}
        country={countryCode()}
        inputClassName={`${style.mobileInput}`}
        className={`${style.phoneNumberContainer}`}
        flagComponent={ FlagComponent }
      />
    </form>
  )
}

export default localised(PhoneNumberInput)
