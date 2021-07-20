import { h, Component } from 'preact'
import { kebabCase } from '~utils/string'
import { isEmpty } from '~utils/object'
import classNames from 'classnames'
import {
  idDocumentOptions,
  poaDocumentOptions,
  // type DocumentOptionsType,
} from './documentTypes'
import { getCountryDataForDocumentType } from '../../supported-documents'
import { localised /* , type LocalisedType */ } from '../../locales'
import { isDesktop } from '~utils'
import style from './style.scss'

/* type Props = {
  className?: string,
  documentTypes: Object,
  country?: string,
  actions: Object,
  group: string,
  nextStep: () => void,
} & LocalisedType

type WithDefaultOptions = {
  defaultOptions: () => DocumentOptionsType[],
} */

const always = () => true

// The 'type' value of these options must match the API document types.
// See https://documentation.onfido.com/#document-types
class DocumentSelector extends Component {
  getOptions = () => {
    const { documentTypes, defaultOptions, country = 'GBR' } = this.props
    const defaultDocOptions = defaultOptions().filter(
      ({ checkAvailableInCountry = always }) => checkAvailableInCountry(country)
    )
    const checkAvailableType = isEmpty(documentTypes)
      ? always
      : (type) => documentTypes[type]
    const options = defaultDocOptions.filter(({ type }) =>
      checkAvailableType(type)
    )

    // If no valid options passed, default to defaultDocOptions
    return options.length ? options : defaultDocOptions
  }

  handleSelect = (documentType) => {
    const { group, actions, documentTypes, nextStep } = this.props
    if (group === 'proof_of_address') {
      actions.setPoADocumentType(documentType)
    } else {
      actions.setIdDocumentType(documentType)
      const selectedDocumentTypeConfig = documentTypes
        ? documentTypes[documentType]
        : null
      if (documentType !== 'passport' && selectedDocumentTypeConfig) {
        const countryCode = selectedDocumentTypeConfig.country
        const supportedCountry = getCountryDataForDocumentType(
          countryCode,
          documentType
        )
        if (supportedCountry) {
          actions.setIdDocumentIssuingCountry(supportedCountry)
        } else if (typeof selectedDocumentTypeConfig === 'object') {
          actions.resetIdDocumentIssuingCountry()
          if (countryCode !== null) {
            // Integrators can set document type country to null to suppress Country Selection without setting a country
            // Anything else is an invalid country code
            console.error('Unsupported countryCode:', countryCode)
          }
        }
      }
    }
    nextStep()
  }

  renderOption = (option) => (
    <li>
      <button
        type="button"
        onClick={() => this.handleSelect(option.type)}
        className={classNames(style.option, {
          [style.optionHoverDesktop]: isDesktop,
        })}
        data-onfido-qa={option.type}
      >
        <div className={`${style.icon} ${style[option.icon]}`} />
        <div className={style.content}>
          <div className={style.optionMain}>
            <p className={style.label}>{option.label}</p>
            {option.detail && <div className={style.hint}>{option.detail}</div>}
            {option.warning && (
              <div className={style.warning}>{option.warning}</div>
            )}
          </div>
          {option.eStatements && (
            <div className={style.tag}>{option.eStatements}</div>
          )}
        </div>
      </button>
    </li>
  )

  render() {
    const documentOptions = this.getOptions()
    const { className, translate } = this.props
    return (
      <ul
        aria-label={translate('doc_select.list_accessibility')}
        className={classNames(style.list, className)}
      >
        {documentOptions.map(this.renderOption)}
      </ul>
    )
  }
}

const LocalisedDocumentSelector = localised(DocumentSelector)

const withDefaultOptions = (iconCopyDisplayOptionsByType) => {
  const DocumentSelectorWithDefaultOptions = (props) => (
    <LocalisedDocumentSelector
      {...props}
      defaultOptions={() => {
        const typeList = Object.keys(iconCopyDisplayOptionsByType)

        return typeList.map((type) => {
          const {
            icon = `icon-${kebabCase(type)}`,
            labelKey,
            detailKey,
            warningKey,
            eStatementsKey,
            checkAvailableInCountry,
          } = iconCopyDisplayOptionsByType[type]

          return {
            icon,
            type,
            label: props.translate(labelKey),
            detail: detailKey ? props.translate(detailKey) : '',
            warning: warningKey ? props.translate(warningKey) : '',
            eStatements: props.translate(eStatementsKey),
            checkAvailableInCountry,
          }
        })
      }}
    />
  )

  return DocumentSelectorWithDefaultOptions
}

export const IdentityDocumentSelector = withDefaultOptions(idDocumentOptions)

export const PoADocumentSelector = withDefaultOptions(poaDocumentOptions)
