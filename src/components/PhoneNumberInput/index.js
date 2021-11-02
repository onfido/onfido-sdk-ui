import { h, Component } from 'preact'
import PhoneInput from 'react-phone-number-input'
import { parsePhoneNumberFromString } from 'libphonenumber-js/mobile'
import classNames from 'classnames'
import { localised } from '~locales'
import { getCountryFlagSrc } from '~supported-documents'
import 'react-phone-number-input/style.css'
import style from './style.scss'

const FlagComponent = ({ country }) => (
  <span
    className={classNames('react-phone-number-input__icon', style.flagIcon)}
    style={{
      'background-image': `url(${getCountryFlagSrc(country, 'rectangle')})`,
    }}
  />
)

class PhoneNumberInput extends Component {
  componentDidMount() {
    const { sms, actions } = this.props
    const initialNumber = sms.number ? sms.number : ''
    this.validateNumber(initialNumber, actions)
    this.injectForCountrySelectAriaLabel()
  }

  injectForCountrySelectAriaLabel = () => {
    const { options = {} } = this.props
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
        this.props.translate('country_select.search.accessibility')
      )
    }
  }

  onChange = (number) => {
    const { clearErrors, actions } = this.props
    clearErrors()
    const numberString = number ? number : ''
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
    const { translate, smsNumberCountryCode, sms = {} } = this.props
    const placeholderLabel = translate(
      'get_link.number_field_input_placeholder'
    )
    return (
      <form
        aria-labelledby="phoneNumberInput"
        onSubmit={(e) => e.preventDefault()}
      >
        <PhoneInput
          id="phoneNumberInput"
          placeholder={placeholderLabel}
          value={sms.number || ''}
          onChange={this.onChange}
          defaultCountry={smsNumberCountryCode}
          inputClassName={`${style.mobileInput}`}
          className={`${style.phoneNumberContainer}`}
          flagComponent={FlagComponent}
          aria-label={placeholderLabel}
        />
      </form>
    )
  }
}

export default localised(PhoneNumberInput)
