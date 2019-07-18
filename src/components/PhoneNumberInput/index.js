import { h, Component} from 'preact'
import PhoneInput from 'react-phone-number-input'
import {parsePhoneNumberFromString} from 'libphonenumber-js'

import 'react-phone-number-input/rrui.css'
import 'react-phone-number-input/style.css'
import style from './style.css'

import classNames from 'classnames';
import {localised} from '../../locales'

const FlagComponent = ({ country, flagsPath }) => (
  <span
    className={ classNames('react-phone-number-input__icon', style.flagIcon) }
    style={{
      'background-image': `url(${ flagsPath }${ country.toLowerCase() }.svg)`
    }}
  />
);

class PhoneNumberInput extends Component {

  componentDidMount() {
    const { sms, actions } = this.props
    const initialNumber = sms.number ? sms.number : ""
    this.validateNumber(initialNumber, actions)
  }

  onChange = (number) => {
    const { clearErrors, actions } = this.props
    clearErrors()
    const numberString = number === undefined || number === null ? "" : number
    this.validateNumber(numberString, actions)
  }

  validateNumber = (number, actions) => {
    const parsedNumber = parsePhoneNumberFromString(number)
    const isValid = parsedNumber ? parsedNumber.isValid() : false
    if (parsedNumber) {
      actions.setMobileNumber(parsedNumber.number, isValid)
    } else {
      actions.setMobileNumber('', isValid)
    }
  }

  render() {
    const { translate, smsNumberCountryCode, sms = {}} = this.props
    return (
      <form onSubmit={(e) => e.preventDefault()}>
        <PhoneInput placeholder={translate('cross_device.phone_number_placeholder')}
          value={sms.number || ''}
          onChange={this.onChange}
          country={smsNumberCountryCode}
          inputClassName={`${style.mobileInput}`}
          className={`${style.phoneNumberContainer}`}
          flagComponent={ FlagComponent }
        />
      </form>
    )
  }
}

export default localised(PhoneNumberInput)
