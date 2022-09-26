import { h } from 'preact'
import classNames from 'classnames'
import { isDesktop } from '~utils'
import style from './style.scss'
import { WithLocalisedProps } from '~types/hocs'
import { DocumentTypes, PoaTypes } from '~types/steps'

export type DocumentOptionsType = {
  type: DocumentTypes & PoaTypes
  icon: string
  label: string
  detail?: string
  warning?: string
  eStatements?: string
  checkAvailableInCountry?: (county: string) => boolean
}

export type DocumentTypeConfiguration = {
  labelKey: string
  detailKey?: string
  eStatementsKey?: string
  warningKey?: string
  icon?: string
  checkAvailableInCountry?: (country: string) => boolean
}

export type DocumentOptions =
  | Record<DocumentTypes, DocumentTypeConfiguration>
  | Record<PoaTypes, DocumentTypeConfiguration>

export type HandleDocumentSelect = (option: DocumentOptionsType) => void

export type Props = {
  className?: string
  options: DocumentOptionsType[]
  handleDocumentSelect: HandleDocumentSelect
} & WithLocalisedProps

export const DocumentList = ({
  className,
  translate,
  options,
  handleDocumentSelect,
}: Props) => (
  <ul
    aria-label={translate('doc_select.list_accessibility')}
    className={classNames(style.list, className)}
  >
    {options.map((option: DocumentOptionsType) => (
      <li key={option.type}>
        <button
          type="button"
          onClick={() => handleDocumentSelect(option)}
          className={classNames(style.option, {
            [style.optionHoverDesktop]: isDesktop,
          })}
          data-onfido-qa={option.type}
        >
          <div className={`${style.icon} ${style[option.icon]}`} />
          <div className={style.content}>
            <div className={style.optionMain}>
              <p className={style.label}>{option.label}</p>
              {option.detail && (
                <div className={style.hint}>{option.detail}</div>
              )}
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
    ))}
  </ul>
)
