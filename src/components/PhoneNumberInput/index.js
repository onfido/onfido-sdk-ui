import { h, Component} from 'preact'
import PhoneInput from 'react-phone-number-input/native'
import { parsePhoneNumberFromString } from 'libphonenumber-js/mobile'

import 'react-phone-number-input/style.css'
import style from './style.css'

import classNames from 'classnames';
import { localised } from '../../locales'

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
    this.injectForCountrySelectAriaLabel()
  }

  injectForCountrySelectAriaLabel = () => {
    // HACK: This is necessary as react-phone-number-input library is not actually setting country select aria-label
    const countrySelect = document.getElementsByClassName('react-phone-number-input__country-select')
    if (countrySelect && countrySelect.length > 0) {
      countrySelect[0].setAttribute('aria-label', this.props.translate('accessibility.country_select'))
    }
  }

  onChange = (number) => {
    const { clearErrors, actions } = this.props
    clearErrors()
    const numberString = number ? number : ""
    this.validateNumber(numberString, actions)
  }

  validateNumber = (number, actions) => {
    const parsedNumber = parsePhoneNumberFromString(number)
    if (parsedNumber) {
      actions.setMobileNumber(parsedNumber.number, parsedNumber.isValid())
    } else {
      actions.setMobileNumber('', false)
    }
  }

  render() {
    const { translate, smsNumberCountryCode, sms = {}} = this.props
    const placeholderLabel = translate('cross_device.phone_number_placeholder')
    return (
      <form aria-labelledby='phoneNumberInput' onSubmit={(e) => e.preventDefault()}>
        <PhoneInput
          id='phoneNumberInput'
          placeholder={placeholderLabel}
          value={sms.number || ''}
          onChange={this.onChange}
          country={smsNumberCountryCode}
          inputClassName={`${style.mobileInput}`}
          className={`${style.phoneNumberContainer}`}
          flagComponent={ FlagComponent }
          aria-label={placeholderLabel}
        />
      </form>
    )
  }
}

export default localised(PhoneNumberInput)
