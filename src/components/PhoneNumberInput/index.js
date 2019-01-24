import { h } from 'preact'
import PhoneNumber from 'react-phone-number-input'

import classNames from 'classnames';
import {localised} from '../../locales'


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

const PhoneNumberInput = ({ translate, clearErrors, actions = {}, sms = {}, smsNumberCountryCode}) => {

  const onChange = (number) => {
    clearErrors()
    actions.setMobileNumber(number)
  }

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <PhoneNumber placeholder={translate('cross_device.phone_number_placeholder')}
        value={sms.number || ''}
        onChange={onChange}
        country={smsNumberCountryCode}
        inputClassName={`${style.mobileInput}`}
        className={`${style.phoneNumberContainer}`}
        flagComponent={ FlagComponent }
      />
    </form>
  )
}

export default localised(PhoneNumberInput)
