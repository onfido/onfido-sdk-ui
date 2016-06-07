import { h, Component } from 'preact'
import { route } from 'preact-router'
import Dropdown from '../Dropdown'

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
    const { setDocumentType, nextLink } = this.props
    setDocumentType(option.value)
    route(nextLink, true)
  }

  render() {
    return (
      <Dropdown
        options={options}
        onChange={this.handleChange}
        placeholder="Select document type"
      />
    )
  }
}
