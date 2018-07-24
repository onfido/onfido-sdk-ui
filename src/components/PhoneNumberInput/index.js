import { h } from 'preact'
import PhoneNumber, {isValidPhoneNumber} from 'react-phone-number-input'
import classNames from 'classnames';

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

const PhoneNumberInput = ({ i18n, clearErrors, actions = {}}) => {

  const onChange = (number) => {
    clearErrors()
    const valid = isValidPhoneNumber(number)
    actions.setMobileNumber({number, valid})
  }

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <PhoneNumber placeholder={i18n.t('cross_device.phone_number_placeholder')}
        onChange={onChange}
        country="GB"
        inputClassName={`${style.mobileInput}`}
        className={`${style.phoneNumberContainer}`}
        flagComponent={ FlagComponent }
      />
    </form>
  )
}

export default PhoneNumberInput
