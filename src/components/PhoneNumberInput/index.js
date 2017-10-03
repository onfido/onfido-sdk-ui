import { h, Component } from 'preact'
import PhoneNumber from 'react-phone-number-input'
import 'react-phone-number-input/rrui.css'
import 'react-phone-number-input/style.css'

class PhoneNumberWithState extends Component {
  onChange = (value) => this.setState({value})
  render = ()=>
    <PhoneNumber onChange={this.onChange} value={this.state.value}/>
}

export default PhoneNumberWithState
