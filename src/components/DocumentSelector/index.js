import { h, Component } from 'preact'
import style from './style.css'

// The value of these options must match the API document types.
// See https://documentation.onfido.com/#document-types
const options = (i18n) => [{
  value: 'passport',
  label: i18n.t('passport'),
  icon: 'icon-passport'
}, {
  value: 'driving_licence',
  label: i18n.t('driving_licence'),
  icon: 'icon-license'
}, {
  value: 'national_identity_card',
  label: i18n.t('national_identity_card'),
  icon: 'icon-identity'
}]

class DocumentSelector extends Component {

  handleSelect = (e, value) => {
    e.stopPropagation()

    const { setDocumentType, nextStep } = this.props
    setDocumentType(value)
    nextStep()
  }

  renderOption = (option) => {
    return (
      <div
        class={style.option}
        onClick={(e) => this.handleSelect(e, option.value)}
      >
        <div class={`${style.icon} ${style[option.icon]}`}></div>
        <span>{option.label}</span>
      </div>
    )
  }

  render() {
    const documentOptions = options(this.props.i18n)
    return (
      <div class={style.selector}>
        {documentOptions.map((op) => this.renderOption(op))}
      </div>
    )
  }
}

export default DocumentSelector;
