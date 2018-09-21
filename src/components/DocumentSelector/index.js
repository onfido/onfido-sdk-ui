// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import style from './style.css'
import { kebabCase } from '../utils/string'
import { isEmpty } from '../utils/object'
import classNames from 'classnames'
import { idDocumentOptions, poaDocumentOptions } from './documentTypes'
import type { DocumentOptionsType, GroupType } from './documentTypes'

type Props = {
  className?: string,
  documentTypes: Object,
  country?: string,
  i18n: Object,
  setDocumentType: string => void,
  nextStep: () => void,
}

type WithDefaultOptions = {
  defaultOptions: Object => DocumentOptionsType[],
}

const defaultCountryAvailability: ?string => boolean = () => true

// The value of these options must match the API document types.
// See https://documentation.onfido.com/#document-types
class DocumentSelector extends Component<Props & WithDefaultOptions> {

  getOptions = () => {
    const {i18n, documentTypes, defaultOptions, country = 'GBR' } = this.props
    const defaultDocOptions = defaultOptions(i18n)

    const options = defaultDocOptions
      .filter(({ isAvailableInCountry = defaultCountryAvailability }) => isAvailableInCountry(country))
      .filter(({ value }) => isEmpty(documentTypes) || documentTypes[value])

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

const withDefaultOptions = (types: Object, group: GroupType) =>
  (props: Props) =>
    <DocumentSelector
      {...props}
      defaultOptions={ i18n =>
        Object.keys(types).map(value => {
          const { icon = `icon-${kebabCase(value)}`, hint, warning, ...other } = types[value]
          return {
            ...other,
            icon,
            value,
            label: i18n.t(value),
            hint: hint ? i18n.t(`document_selector.${group}.${hint}`) : '',
            warning: warning ? i18n.t(`document_selector.${group}.${warning}`) : '',
          }
        })
      }
    />

export const IdentityDocumentSelector = withDefaultOptions(idDocumentOptions, 'identity')

export const PoADocumentSelector = withDefaultOptions(poaDocumentOptions, 'proof_of_address')