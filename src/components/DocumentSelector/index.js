import { h, Component } from 'preact'
import Dropdown from '../Dropdown'
import NativeListener from 'react-native-listener'

const options = [{
  value: 'passport',
  label: 'Passport',
  icon: 'icon-passport'
}, {
  value: 'identity',
  label: 'Identity Card',
  icon: 'icon-identity'
}, {
  value: 'license',
  label: 'Drivers License',
  icon: 'icon-license'
}]

export default class DocumentSelector extends Component {

  handleChange = (option) => {
    const { setDocumentType, changeView } = this.props
    setDocumentType(option.value)
    changeView(true, 'document')
  }

  render() {
    return (
      <NativeListener stopClick>
        <Dropdown
          options={options}
          onChange={this.handleChange}
          placeholder="Select document type"
        />
      </NativeListener>
    )
  }
}
