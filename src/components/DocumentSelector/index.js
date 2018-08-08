// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import style from './style.css'
import classNames from 'classnames'

type DocumentTypeOption = {
  eStatementAccepted?: boolean,
  warning?: string,
  hint?: string,
  icon?: string,
  label?: string,
  value: string,
}

type Props = {
  className?: string,
  documentTypes: { [string]: any },
  i18n: Object,
  setDocumentType: string => void,
  nextStep: () => void,
}

type WithDefaultOptions = {
  defaultOptions: Object => DocumentTypeOption[],
}

// The value of these options must match the API document types.
// See https://documentation.onfido.com/#document-types
class DocumentSelector extends Component<Props & WithDefaultOptions> {

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

  renderOption = (option) => (
    <div
      class={style.option}
      onClick={e => this.handleSelect(e, option.value)}
    >
      <div className={`${style.icon} ${style[option.icon]}`}></div>{/*`*/}
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
            this.props.i18n.t('document_selector.proof_of_address.estatements_accepted')
          }</div>
        }
      </div>
    </div>
  )

  render() {
    const documentOptions = this.getOptions()
    const { className } = this.props
    return (
      <div className={classNames(style.wrapper, className)}>
        {documentOptions.map(this.renderOption)}
      </div>
    )
  }
}

const snakeToKebabCase = str => str.replace(/_/g, '-')

const documentWithDefaultOptions = (types: {[string]: DocumentTypeOption}, copyNamespace) =>
  (props: Props) =>
    <DocumentSelector
      {...props}
      defaultOptions={ i18n =>
        Object.keys(types).map(key => {
          const { icon = `icon-${snakeToKebabCase(key)}`, hint, warning, ...other } = types[key]
          return {
            ...other,
            icon,
            label: i18n.t(key),
            hint: hint ? i18n.t(`document_selector.${copyNamespace}.${hint}`) : '',
            warning: warning ? i18n.t(`document_selector.${copyNamespace}.${warning}`) : '',
          }
        })
      }
    />

export const IdentityDocumentSelector = documentWithDefaultOptions({
  passport: {
    value: 'passport',
    hint: 'passport_hint',
  },
  driving_licence: {
    value: 'driving_licence',
    hint: 'driving_licence_hint',
  },
  national_identity_card: {
    value: 'national_identity_card',
    hint: 'national_identity_card_hint',
  },
}, 'identity')

export const PoADocumentSelector = documentWithDefaultOptions({
  bank_statement: {
    value: 'bank_building_society_statement',
    eStatementAccepted: true,
  },
  credit_card_statement: {
    value: 'credit_card_statement',
    eStatementAccepted: true,
  },
  utility_bill: {
    value: 'unknown',
    hint: 'utility_bill_hint',
    warning: 'utility_bill_warning',
    eStatementAccepted: true,
  },
  benefits_letter: {
    value: 'benefits_letter',
    hint: 'benefits_letter_hint',
    icon: 'icon-letter',
  },
  council_tax_letter: {
    value: 'council_tax',
    icon: 'icon-letter',
  }
}, 'proof_of_address')
