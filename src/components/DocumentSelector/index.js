import { h, Component } from 'preact'
import { route } from 'preact-router'
import style from './style.css'

const options = [{
  value: 'passport',
  label: 'Passport',
  icon: 'icon-passport'
}, {
  value: 'license',
  label: 'Driver\'s License',
  icon: 'icon-license'
}, {
  value: 'identity',
  label: 'Identity Card',
  icon: 'icon-identity'
}]

class DocumentSelector extends Component {

  handleSelect = (e, value) => {
    e.stopPropagation()

    const { setDocumentType, nextLink } = this.props
    setDocumentType(value)
    route(nextLink, false)
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
    return (
      <div class={style.selector}>
        {options.map((op) => this.renderOption(op))}
      </div>
    )
  }
}

export default DocumentSelector;
