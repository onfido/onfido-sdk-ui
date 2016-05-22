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

export default class DocumentSelector {

  handleChange = (option) => {
    const { setDocumentType } = this.props
    setDocumentType(option.value)
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
