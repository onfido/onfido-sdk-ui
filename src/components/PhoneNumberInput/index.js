import { h, Component} from 'preact'
import PhoneNumber, {isValidPhoneNumber} from 'react-phone-number-input'

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

class PhoneNumberInput extends Component {
  componentDidMount() {
    const { sms, actions } = this.props
    if (sms && sms.number) {
      this.validateNumber(sms.number, actions)
    }
  }

  onChange = (number) => {
    const { clearErrors, actions } = this.props
    clearErrors()
    this.validateNumber(number, actions)
  }

  validateNumber = (number, actions) => {
    const valid = isValidPhoneNumber(number)
    actions.setMobileNumber(number, valid)
  }

  predefinedNumber = () => this.props.sms && this.props.sms.valid ? this.props.sms.number : ''

  render() {
    const { translate, smsNumberCountryCode } = this.props
    return (
      <form onSubmit={(e) => e.preventDefault()}>
        <PhoneNumber placeholder={translate('cross_device.phone_number_placeholder')}
          value={this.predefinedNumber()}
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
