import { h, Component } from 'preact'
import style from './style.css'

type DocumentTypeOption = {
  eStatementAccepted?: string,
  hint?: string,
  icon: string,
  label: string,
  value: string,
}

type Props = {
  defaultOptions: DocumentTypeOption[],
  i18n: Object,
  renderOption: (DocumentTypeOption, Function) => React.Node<*>,
}
// The value of these options must match the API document types.
// See https://documentation.onfido.com/#document-types
class DocumentSelector extends Component<Props> {

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
      <div className={style.selector}>
        {documentOptions.map(option =>
          this.props.renderOption(option, this.handleSelect)
        )}
      </div>
    )
  }
}

const snakeCase = str => str.replace(/_/g, '-')

export const IdentityDocumentSelector = props =>
  <DocumentSelector
    {...props}
    className={style.identity}
    renderOption = {(option, handleSelect) => (
      <div
        className={style.option}
        onClick={e => handleSelect(e, option.value)}
      >
        <div className={`${style.icon} ${style[option.icon]}`}></div>{ /*`*/ }
        <span>{option.label}</span>
      </div>
    )}
    defaultOptions={ i18n =>
      ['passport', 'driving_licence', 'national_identity_card'].map(value => {
        const conf = ({
        value,
        label: i18n.t(value),
        icon: `icon-${snakeCase(value)}`,
      }) 
        return conf;
      })
    }
  />

const defaultPOATypes = {
  bank_building_society_statement: {
    value: 'bank_statement',
    eStatementAccepted: true,  
  },
  credit_card_statement: {
    value: 'credit_card_statement',
    eStatementAccepted: true
  },
  utility_bill: {
    value: 'unknown',
    hint: 'Gas, electricity, water, landline, or broadband',
    eStatementAccepted: true,
  },
  benefits_letter: {
    value: 'benefits_letter',
    hint: 'Government authorised household benefits eg. Jobseeker allowance, Housing benefit',
  },
  council_tax: {
    value: 'council_tax',
  }
}

export const POADocumentSelector = props =>
  <DocumentSelector
    {...props}
    className={style['proof-of-address']}
    renderOption = {(option: DocumentTypeOption, handleSelect) => (
      <div
        class={style.option}
        onClick={e => handleSelect(e, option.value)}
      >
        <div className={`${style.icon} ${style[option.icon]}`}></div>
        <span>
          {option.label}
          {option.hint &&
            <span className={style.hint}>{option.hint}</span>
          }
          {option.eStatementAccepted &&
            <span className={style.eStatement}>{
              props.i18n('document_selector.estatements_accepted')
            }</span>
          }
        </span>
      </div>
    )}
    defaultOptions={ i18n =>
      Object.keys(defaultPOATypes).map(type => ({
        ...defaultPOATypes[type],
        label: i18n.t(type),
        icon: `icon-${snakeCase(type)}`,
      }))
    }
  />
