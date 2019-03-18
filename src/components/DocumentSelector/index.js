// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import style from './style.css'
import { kebabCase } from '~utils/string'
import { isEmpty } from '../utils/object'
import classNames from 'classnames'
import { idDocumentOptions, poaDocumentOptions } from './documentTypes'
import type { DocumentOptionsType, GroupType } from './documentTypes'

import { localised } from '../../locales'
import type { LocalisedType } from '../../locales'

type Props = {
  className?: string,
  documentTypes: Object,
  country?: string,
  setDocumentType: string => void,
  nextStep: () => void,
} & LocalisedType

type WithDefaultOptions = {
  defaultOptions: () => DocumentOptionsType[],
}

const always: any => boolean = () => true

// The value of these options must match the API document types.
// See https://documentation.onfido.com/#document-types
class DocumentSelector extends Component<Props & WithDefaultOptions> {

  getOptions = () => {
    const {documentTypes, defaultOptions, country = 'GBR' } = this.props
    const defaultDocOptions = defaultOptions().filter(
      ({ checkAvailableInCountry = always }) => checkAvailableInCountry(country)
    )
    const checkAvailableType = isEmpty(documentTypes) ? always : type => documentTypes[type]
    const options = defaultDocOptions.filter(({ value: type }) => checkAvailableType(type))

    // If no valid options passed, default to defaultDocOptions
    return options.length ? options : defaultDocOptions
  }

  handleSelect = (e, value: string) => {
    e.stopPropagation()
    const { setDocumentType, nextStep } = this.props
    setDocumentType(value)
    nextStep()
  }

  renderOption = (option: DocumentOptionsType) => (
    <div
      class={style.option}
      onClick={e => this.handleSelect(e, option.value)}
    >
      <div className={`${style.icon} ${style[option.icon]}`} />
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

const withDefaultOptions = (types: Object, group: GroupType) =>
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

export const IdentityDocumentSelector = withDefaultOptions(idDocumentOptions, 'identity')

export const PoADocumentSelector = withDefaultOptions(poaDocumentOptions, 'proof_of_address')
