import { h, Component } from 'preact'
import PhoneNumber, {isValidPhoneNumber} from 'react-phone-number-input'
import 'react-phone-number-input/rrui.css'
import 'react-phone-number-input/style.css'

import style from './style.css'

class PhoneNumberInput extends Component {
  constructor(props) {
    super(props)
    this.state = { country: 'GB' }
    this.getCountry()
  }

  getCountry = () => {
    const url = 'https://freegeoip.net/json/'
    const request = new XMLHttpRequest()
    request.open('GET', url)
    request.onload = () => {
      const country = JSON.parse(request.response)['country_code']
      this.setState({country})
    }
    request.send()
  }

  onChange = (number) => {
    this.props.clearErrors()
    const valid = isValidPhoneNumber(number)
    this.props.actions.setMobileNumber({number, valid})
  }

  render = () =>
    <PhoneNumber placeholder='Enter mobile number'
      onChange={this.onChange}
      value={this.props.sms.number}
      country={this.state.country}
      inputClassName={`${style.mobileInput}`}
      className={`${style.phoneNumberContainer}`}
    />
}

export default PhoneNumberInput
