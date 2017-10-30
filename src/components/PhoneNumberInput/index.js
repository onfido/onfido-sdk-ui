import { h, Component } from 'preact'
import PhoneNumber, {isValidPhoneNumber} from 'react-phone-number-input'
import 'react-phone-number-input/rrui.css'
import 'react-phone-number-input/style.css'

class PhoneNumberInput extends Component {
  constructor(props) {
    super(props)
    this.state = { value: null}
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
  customStyle = {
    float: 'left',
    'margin-left': '12px'
  }
  render = ()=>
    <PhoneNumber placeholder='Enter mobile number'
      onChange={this.onChange}
      value={this.state.value}
      convertToNational
      style={this.customStyle}
    />
}

export default PhoneNumberInput
