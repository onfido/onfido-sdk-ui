import { h, Component } from 'preact'
import style from './style.css'
import theme from '../Theme/style.css'
import classNames from 'classnames';

type DocumentTypeOption = {
  eStatementAccepted?: string,
  warning?: string,
  hint?: string,
  icon: string,
  label: string,
  value: string,
}

type Props = {
  className: string,
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
    const { className } = this.props
    return (
      <div className={classNames(style.options, theme.thickWrapper, className)}>
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
        <div className={`${style.icon} ${style[option.icon]}`}></div>
        <div className={style.content}>{option.label}</div>
      </div>
    )}
    defaultOptions={ i18n =>
      ['passport', 'driving_licence', 'national_identity_card'].map(value => ({
        value,
        label: i18n.t(value),
        icon: `icon-${snakeCase(value)}`,
      }))
    }
  />

const defaultPOATypes = {
  bank_statement: {
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
    warning: 'Mobile phone bills not accepted',
    eStatementAccepted: true,
  },
  benefits_letter: {
    value: 'benefits_letter',
    hint: 'Government authorised household benefits eg. Jobseeker allowance, Housing benefit',
    icon: 'icon-letter',
  },
  council_tax_letter: {
    value: 'council_tax',
    icon: 'icon-letter',
  }
}

export const POADocumentSelector = props =>
  <DocumentSelector
    {...props}
    className={style.proofOfAddress}
    renderOption = {(option, handleSelect) => (
      <div
        class={style.option}
        onClick={e => handleSelect(e, option.value)}
      >
        <div className={`${style.icon} ${style[option.icon]}`}></div>
        <div className={style.content}>
          <div className={style.optionMain}>
            <p className={style.label}>{option.label}</p>
            {option.hint &&
              <div className={style.hint}>{option.hint}</div>
            }
            {option.warning &&
              <div className={style.warning}>{option.warning}</div>
            }
          </div>
          {option.eStatementAccepted &&
            <div className={style.tag}>{
              props.i18n.t('document_selector.proof_of_address.estatements_accepted')
            }</div>
          }
        </div>
      </div>
    )}
    defaultOptions={ i18n =>
      Object.keys(defaultPOATypes).map(type => ({
        label: i18n.t(type),
        icon: `icon-${snakeCase(type)}`,
        ...defaultPOATypes[type],
      }))
    }
  />
