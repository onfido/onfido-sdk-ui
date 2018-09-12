// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import style from './style.css'
import { kebabCase } from '../utils/string'
import { find } from '../utils/object'
import classNames from 'classnames'
import { localised } from '../../locales'

type DocumentTypeOption = {
  eStatementAccepted?: boolean,
  warning?: string,
  hint?: string,
  icon: string,
  label: string,
  value: string,
}

type Props = {
  className?: string,
  documentTypes: { [string]: any },
  setDocumentType: string => void,
  nextStep: () => void,
  translate: string => string,
}

type WithDefaultOptions = {
  defaultOptions: () => DocumentTypeOption[],
}

// The value of these options must match the API document types.
// See https://documentation.onfido.com/#document-types
class DocumentSelector extends Component<Props & WithDefaultOptions> {

  getOptions = () => {
    const {documentTypes, defaultOptions} = this.props
    const defaultDocOptions = defaultOptions()
    
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
            this.props.translate('document_selector.proof_of_address.estatements_accepted')
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

const LocalisedDocumentSelector = localised(DocumentSelector)

const documentWithDefaultOptions = (types: Object, group: groupType) =>
  (props: Props) =>
    <LocalisedDocumentSelector
      {...props}
      defaultOptions={ () =>
        Object.keys(types).map(value => {
          const { icon = `icon-${kebabCase(value)}`, hint, warning, ...other } = types[value]
          return {
            ...other,
            icon,
            value,
            label: props.translate(value),
            hint: hint ? props.translate(`document_selector.${group}.${hint}`) : '',
            warning: warning ? props.translate(`document_selector.${group}.${warning}`) : '',
          }
        })
      }
    />

const identityDocsOptions = {
  passport: {
    hint: 'passport_hint',
  },
  driving_licence: {
    hint: 'driving_licence_hint',
  },
  national_identity_card: {
    hint: 'national_identity_card_hint',
  },
}

export type groupType = 'identity' | 'proof_of_address'

export const identityDocumentTypes: string[] = Object.keys(identityDocsOptions)

export const IdentityDocumentSelector = documentWithDefaultOptions(identityDocsOptions, 'identity')

const poaDocsOptions = {
  bank_building_society_statement: {
    eStatementAccepted: true,
  },
  utility_bill: {
    hint: 'utility_bill_hint',
    warning: 'utility_bill_warning',
    eStatementAccepted: true,
  },
  benefit_letters: {
    hint: 'benefits_letter_hint',
    icon: 'icon-letter',
  },
  council_tax: {
    icon: 'icon-letter',
  }
}

export const poaDocumentTypes: string[] = Object.keys(poaDocsOptions)

export const PoADocumentSelector = documentWithDefaultOptions(poaDocsOptions, 'proof_of_address')

export const getDocumentTypeGroup = (documentType: string): groupType  =>
  find({
    'proof_of_address': poaDocumentTypes,
    'identity': identityDocumentTypes,
  }, types =>
    // $FlowFixMe
    Array.includes(types, documentType)
  )
