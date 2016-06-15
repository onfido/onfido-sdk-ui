import { h, Component } from 'preact'
import { route } from 'preact-router'

const options = [{
  value: 'identity',
  label: 'Identity Card',
  icon: 'icon-identity'
}, {
  value: 'passport',
  label: 'Passport',
  icon: 'icon-passport'
}, {
  value: 'license',
  label: 'Drivers License',
  icon: 'icon-license'
}]

export default class DocumentSelector extends Component {

  handleSelect = (e, value) => {
    e.stopPropagation()

    const { setDocumentType, nextLink } = this.props
    setDocumentType(value)
    route(nextLink, false)
  }

  renderOption = (option) => {
    return (
      <div
        class="onfido-document-option"
        onClick={(e) => this.handleSelect(e, option.value)}
      >
        <div class={`onfido-document-option__icon ${option.icon}`}></div>
        <span>{option.label}</span>
      </div>
    )
  }

  render() {
    return (
      <div class="onfido-document-selector">
        {options.map((op) => this.renderOption(op))}
      </div>
    )
  }
}
