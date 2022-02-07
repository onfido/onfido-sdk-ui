import { Component, h } from 'preact'
import { kebabCase } from '~utils/string'
import { isEmpty } from '~utils/object'
import classNames from 'classnames'
import { DocumentOptions, DocumentOptionsType } from './documentTypes'
import { isDesktop } from '~utils'
import style from './style.scss'
import { StepComponentBaseProps } from '~types/routers'
import { TranslateCallback } from '~types/locales'
import PageTitle from '../PageTitle'
import { LocaleContext } from '~locales'
import { DocumentTypeConfig, DocumentTypes, PoaTypes } from '~types/steps'

const always = () => true

export type Props = {
  className?: string
  documentTypes: Partial<Record<DocumentTypes, DocumentTypeConfig>>
  country?: string
  type: DocumentTypes | PoaTypes
  autoFocusOnInitialScreenTitle?: boolean
} & StepComponentBaseProps

// The 'type' value of these options must match the API document types.
// See https://documentation.onfido.com/#document-types
export abstract class DocumentSelectorBase extends Component<Props> {
  private defaultOptions: DocumentOptionsType[] | undefined = undefined

  private getOptions = (
    translate: (key: string, options?: Record<string, unknown>) => string
  ) => {
    const { documentTypes, country = 'GBR' } = this.props

    if (!this.defaultOptions) {
      this.defaultOptions = generateDefaultOptions(
        this.getDefaultOptions(),
        translate
      )
    }

    const defaultDocOptions = this.defaultOptions.filter(
      ({ checkAvailableInCountry = always }) => checkAvailableInCountry(country)
    )
    const checkAvailableType = isEmpty(documentTypes)
      ? always
      : (type: DocumentOptionsType) => documentTypes[type.type]
    const options = defaultDocOptions.filter(checkAvailableType)

    // If no valid options passed, default to defaultDocOptions
    return options.length ? options : defaultDocOptions
  }

  handleSelect = (option: DocumentOptionsType) => {
    this.handleDocumentTypeSelected(option)
    this.props.nextStep()
  }

  abstract getDefaultOptions(): DocumentOptions

  abstract handleDocumentTypeSelected(option: DocumentOptionsType): void

  abstract titleTranslationKey(): string

  abstract subTitleTranslationKey(): string

  abstract pageId(): string

  protected shouldAutoFocus(): boolean {
    return false
  }

  render() {
    const { className, country } = this.props

    return (
      <LocaleContext.Consumer>
        {(injectedProps) => {
          if (injectedProps == null) {
            throw new Error(`LocaleContext hasn't been initialized!`)
          }

          const { translate } = injectedProps

          const title = translate(this.titleTranslationKey(), {
            country: !country || country === 'GBR' ? 'UK' : '',
          })

          const subTitle = translate(this.subTitleTranslationKey())
          const options = this.getOptions(translate)

          return (
            <div data-page-id={this.pageId()}>
              <PageTitle
                title={title}
                subTitle={subTitle}
                shouldAutoFocus={this.shouldAutoFocus()}
              />
              <ul
                aria-label={translate('doc_select.list_accessibility')}
                className={classNames(style.list, className)}
              >
                {options.map(this.renderOption)}
              </ul>
            </div>
          )
        }}
      </LocaleContext.Consumer>
    )
  }

  renderOption = (option: DocumentOptionsType) => (
    <li>
      <button
        type="button"
        onClick={() => this.handleSelect(option)}
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
}

function generateDefaultOptions(
  documentOptions: DocumentOptions,
  translate: TranslateCallback
): DocumentOptionsType[] {
  return Object.entries(documentOptions).map(([type, configuration]) => {
    const {
      icon = `icon-${kebabCase(type)}`,
      labelKey,
      detailKey,
      warningKey,
      eStatementsKey,
      checkAvailableInCountry,
    } = configuration

    return {
      icon,
      type: type as DocumentTypes & PoaTypes,
      label: translate(labelKey),
      detail: detailKey ? translate(detailKey) : '',
      warning: warningKey ? translate(warningKey) : '',
      eStatements: eStatementsKey ? translate(eStatementsKey) : '',
      checkAvailableInCountry,
    }
  })
}
