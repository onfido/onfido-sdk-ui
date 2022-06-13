import { h, Component } from 'preact'
import PhoneInput, { Country } from 'react-phone-number-input'
import { parsePhoneNumberFromString } from 'libphonenumber-js/mobile'
import classNames from 'classnames'
import { localised } from '~locales'
import { getCountryFlagSrc } from '~supported-documents'
import 'react-phone-number-input/style.css'
import style from './style.scss'
import { ReduxProps } from '~types/routers'
import { WithLocalisedProps } from '~types/hocs'
import type { SdkOptions } from '~types/sdk'

const FlagComponent = ({ country }: { country: string }) => (
  <span
    className={classNames('react-phone-number-input__icon', style.flagIcon)}
    style={{
      'background-image': `url(${getCountryFlagSrc(country, 'rectangle')})`,
    }}
  />
)

export type PhoneNumberInputProps = {
  sms?: { number?: string }
  smsNumberCountryCode?: Country
  options: SdkOptions
  clearErrors: () => void
} & ReduxProps &
  WithLocalisedProps

class PhoneNumberInput extends Component<PhoneNumberInputProps> {
  componentDidMount() {
    const { sms } = this.props
    const initialNumber = sms.number ? sms.number : ''
    this.validateNumber(initialNumber)
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

  onChange = (number: string) => {
    const { clearErrors } = this.props
    clearErrors()
    const numberString = number ? number : ''
    this.validateNumber(numberString)
  }

  validateNumber = (number: string) => {
    const { actions } = this.props
    const parsedNumber = parsePhoneNumberFromString(number)
    if (parsedNumber) {
      actions.setMobileNumber(parsedNumber.number, parsedNumber.isValid())
    } else {
      actions.setMobileNumber('', false)
    }
  }

  render() {
    const { translate, smsNumberCountryCode, sms } = this.props
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
          className={`${style.phoneNumberContainer}`}
          placeholder={placeholderLabel}
          value={sms?.number || ''}
          onChange={this.onChange}
          defaultCountry={smsNumberCountryCode}
          flagComponent={FlagComponent}
          aria-label={placeholderLabel}
        />
      </form>
    )
  }
}

export default localised(PhoneNumberInput)
