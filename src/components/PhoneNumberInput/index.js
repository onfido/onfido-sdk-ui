import { h, Component } from 'preact'
import PhoneNumber from 'react-phone-number-input'
import 'react-phone-number-input/rrui.css'
import 'react-phone-number-input/style.css'

class PhoneNumberInput extends Component {
  onChange = (value) => this.setState({value})
  render = ()=>
    <PhoneNumber placeholder='Enter mobile number' onChange={this.onChange} value={this.state.value} convertToNational/>
}

export default PhoneNumberInput
