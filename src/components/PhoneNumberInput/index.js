import { h } from 'preact'
import PhoneNumber, {isValidPhoneNumber} from 'react-phone-number-input'
import classNames from 'classnames';
import {localised} from '../../locales'

import 'react-phone-number-input/rrui.css'
import 'react-phone-number-input/style.css'
import style from './style.css'

import { performHttpReq } from '../utils/http'

const FlagComponent = ({ countryCode, flagsPath }) => (
  <span
    className={ classNames('react-phone-number-input__icon', style.flagIcon) }
    style={{
      'background-image': `url(${ flagsPath }${ countryCode.toLowerCase() }.svg)`,
    }}
  />
);

const PhoneNumberInput = ({ token, translate, clearErrors, actions = {}}) => {

  const onChange = (number) => {
    detectIP()
    clearErrors()
    const valid = isValidPhoneNumber(number)
    actions.setMobileNumber({number, valid})
  }

  const detectIP = () => {
    performHttpReq({
      method: 'GET',
      endpoint:'https://geo-ip.eu-west-1.dev.onfido.xyz/lookup',
      token: `Bearer ${token}`
    },
    (res) => console.log(res), (res) => console.log(res))
  }

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <PhoneNumber placeholder={translate('cross_device.phone_number_placeholder')}
        onChange={onChange}
        country="GB"
        inputClassName={`${style.mobileInput}`}
        className={`${style.phoneNumberContainer}`}
        flagComponent={ FlagComponent }
      />
    </form>
  )
}

export default localised(PhoneNumberInput)
