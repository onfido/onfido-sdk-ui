import { h, Component } from 'preact'
import PhoneNumber, {isValidPhoneNumber} from 'react-phone-number-input'
import 'react-phone-number-input/rrui.css'
import 'react-phone-number-input/style.css'

import style from './style.css'

class PhoneNumberInput extends Component {
  constructor(props) {
    super(props)
    this.state = { value: this.props.mobileNumber, country: 'GB' }
    this.updateValidNumber()
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

  onChange = (value) => {
    this.setState({value})
    this.props.clearPreviousAttempts()
    this.updateValidNumber()
  }

  updateValidNumber = () => {
    const number = this.state.value
    const validNumber = isValidPhoneNumber(number)
    if (number && validNumber) {
      this.props.updateNumber(this.state.value)
    }
  }

  render = () =>
    <PhoneNumber placeholder='Enter mobile number'
      onChange={this.onChange}
      value={this.state.value}
      country={this.state.country}
      inputClassName={`${style.mobileInput}`}
      className={`${style.phoneNumberContainer}`}
    />
}

export default PhoneNumberInput
