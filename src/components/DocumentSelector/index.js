import { h, Component } from 'preact'
import style from './style.css'

// The value of these options must match the API document types.
// See https://documentation.onfido.com/#document-types
class DocumentSelector extends Component {

  getOptions = () => {
    const {i18n, documentTypes, defaultOptions} = this.props
    const defaultDocOptions = defaultOptions(i18n)
    
    const options = defaultDocOptions.filter((option) => documentTypes && documentTypes[option.value])
    // If no valid options passed, default to defaultDocOptions
    return options.length ? options : defaultDocOptions
  }

  handleSelect = (e, value) => {
    e.stopPropagation()
    const { setDocumentType, nextStep } = this.props
    setDocumentType(value)
    nextStep()
  }

  render() {
    const documentOptions = this.getOptions()
    return (
      <div class={style.selector}>
        {documentOptions.map(option =>
          this.pros.renderOption(option, this.handleSelect)
        )}
      </div>
    )
  }
}

export const IdentityDocumentSelector = props =>
  <DocumentSelector
    {...props}
    className={styles.identity}
    renderOption = {(option, handleSelect) => (
      <div
        class={style.option}
        onClick={e => handleSelect(e, option.value)}
      >
        <div class={`${style.icon} ${style[option.icon]}`}></div>
        <span>{option.label}</span>
      </div>
    )}
    defaultOptions={ i18n => [{
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
    }]}
  />


export const POADocumentSelector = props =>
  <DocumentSelector
    {...props}
    className={styles['proof-of-address']}
    renderOption = {(option, handleSelect) => (
      <div
        class={style.option}
        onClick={e => handleSelect(e, option.value)}
      >
        <div class={`${style.icon} ${style[option.icon]}`}></div>
        <span>{option.label}</span>
      </div>
    )}
    defaultOptions={ i18n => [
      {
        value: 'work_permit',
      },
      {
        value: 'national_insurance',
        accepts_e_statements: true,
      },
      {
        value: 'birth_certificate',
      },
      {
        value: 'bank_statement'
      },
    ].map(value => ({
      value,
      label: i18n.t(value),
      icon: `icon-${value.replace(/_/g, '-')}`,
    }))}
  />
